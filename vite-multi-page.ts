import path from "path";
import { ViteDevServer } from "vite";
import fs from "fs";
import pug from "pug";
import * as sass from "sass";
import esbuild from "esbuild";

function MultiPagePugPlugin() {
    return {
        name: "vite:multipage-pug",

        configureServer(server: ViteDevServer) {
            const servePugFile = (
                pugFilePath: string,
                res,
                next: Function,
                data: any
            ) => {
                if (!fs.existsSync(pugFilePath)) {
                    return false;
                }

                try {
                    const pugCode = fs.readFileSync(pugFilePath, "utf-8");
                    const compiledFn = pug.compile(pugCode, {
                        filename: pugFilePath,
                        basedir: path.resolve(__dirname, "src"),
                        pretty: true,
                    });
                    let html = compiledFn(data);
                    if (!html.includes("/@vite/client")) {
                        if (html.includes("</head>")) {
                            html = html.replace(
                                "</head>",
                                `<script type="module" src="/@vite/client"></script></head>`
                            );
                        } else if (html.includes("</body>")) {
                            // Либо перед </body>
                            html = html.replace(
                                "</body>",
                                `<script type="module" src="/@vite/client"></script></body>`
                            );
                        } else {
                            // Если ни <head>, ни <body> нет — добавляем скрипт в начало документа
                            html =
                                `<script type="module" src="/@vite/client"></script>` +
                                html;
                        }
                    }
                    res.setHeader("Content-Type", "text/html; charset=utf-8");
                    res.end(html);
                    return true;
                } catch (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end("Pug compile error: " + String(err));
                    return true;
                }
            };

            server.middlewares.use(async (req, res, next) => {
                const url = req.url?.split("?")[0] || "/";
                let route = url.replace(/^\/|\/$/g, "");
                console.log("route");
                console.log(route);
                if (route === "") {
                    const rootPug = path.resolve(__dirname, "src", "index.pug");
                    const served = servePugFile(rootPug, res, next, {
                        siteName: "",
                    });
                    if (served) return;
                    return next();
                }

                const lastPart = route.split("/");
                const nameOfSite = lastPart[0];
                const nameOfPageInSite = lastPart[1];

                if (nameOfPageInSite) {
                    const otherPug = path.resolve(
                        __dirname,
                        "src",
                        "sites",
                        nameOfSite,
                        `${nameOfPageInSite}.pug`
                    );
                    const served = servePugFile(otherPug, res, next, {
                        siteName: nameOfSite,
                    });
                    if (served) return;
                    return next();
                }

                const pagePug = path.resolve(
                    __dirname,
                    "src",
                    "sites",
                    route,
                    "index.pug"
                );
                const served = servePugFile(pagePug, res, next, {
                    siteName: route,
                });
                if (served) return;
                return next();
            });

            const watcher = server.watcher;

            watcher.add("src/**/*.pug");
            watcher.add("src/**/*.ts");
            watcher.add("src/**/*.scss");

            watcher.on("change", (file) => {
                if (
                    file.endsWith(".pug") ||
                    file.endsWith(".scss") ||
                    file.endsWith(".ts")
                ) {
                    console.log(`[WATCHER] Изменён файл: ${file}`);
                    // console.log('[WATCHER] Triggering full-reload');
                    server.ws.send({ type: "full-reload", path: "*" });
                }
            });
        },

        generateBundle(_options, bundle) {
            const pagesDir = path.resolve(__dirname, "src", "sites");
            const dirs = fs.readdirSync(pagesDir, { withFileTypes: true });

            dirs.forEach((dirEnt) => {
                if (!dirEnt.isDirectory()) return;

                const routeName = dirEnt.name;
                const routeDir = path.join(pagesDir, routeName);
                const files = fs.readdirSync(routeDir);

                const pugFiles = files.filter((file) => file.endsWith(".pug"));
                const scssFile = path.join(pagesDir, routeName, "index.scss");
                const tsFile = path.join(pagesDir, routeName, "index.ts");

                // Компиляция SCSS
                let cssOutput = "";
                if (fs.existsSync(scssFile)) {
                    try {
                        const aliasImporter = (
                            url: string,
                            prev: any,
                            done: any
                        ) => {
                            if (url.startsWith("@/")) {
                                const newUrl = path.resolve(
                                    __dirname,
                                    "src",
                                    url.substr(2)
                                );
                                return { file: newUrl };
                            }
                            return null;
                        };
                        const scssResult = sass.renderSync({
                            file: scssFile,
                            // @ts-ignore
                            importer: aliasImporter,
                        });
                        cssOutput = scssResult.css.toString();
                        cssOutput = cssOutput.replace(
                            new RegExp(`@/sites/${routeName}/`, "g"),
                            "../"
                        );
                        this.emitFile({
                            type: "asset",
                            fileName: `${routeName}/css/index.css`,
                            source: cssOutput,
                        });
                    } catch (err) {
                        console.error(
                            `Ошибка компиляции SCSS для ${routeName}:`,
                            err
                        );
                    }
                }

                // Компиляция TS
                let jsOutput = "";
                if (fs.existsSync(tsFile)) {
                    try {
                        const result = esbuild.buildSync({
                            entryPoints: [tsFile],
                            bundle: true, // Бандлим все зависимости в один файл
                            platform: "browser", // Для браузера
                            format: "iife", // Немедленно вызываемая функция (IIFE)
                            sourcemap: false,
                            write: false, // Результат не пишется сразу на диск
                            target: ["es2015"], // Целевая версия JS
                        });
                        if (
                            result.outputFiles &&
                            result.outputFiles.length > 0
                        ) {
                            jsOutput = result.outputFiles[0].text;
                            this.emitFile({
                                type: "asset",
                                fileName: `${routeName}/js/index.js`,
                                source: jsOutput,
                            });
                        }
                    } catch (err) {
                        console.error(
                            `Ошибка компиляции TS для ${routeName}:`,
                            err
                        );
                    }
                }

                pugFiles.forEach((pugFileName) => {
                    const pugFilePath = path.join(routeDir, pugFileName);

                    if (!fs.existsSync(pugFilePath)) return;

                    // Считываем содержимое Pug файла
                    const pugCode = fs.readFileSync(pugFilePath, "utf-8");

                    // Компиляция Pug файла
                    const compiledFn = pug.compile(pugCode, {
                        filename: pugFilePath,
                        basedir: path.resolve(__dirname, "src"),
                        pretty: true,
                    });

                    // Создаем HTML контент
                    const html = compiledFn({
                        siteName: routeName,
                    });

                    // Модификация ссылок в HTML
                    let finalHtml = html
                        .replace(
                            `/src/sites/${routeName}/index.scss`,
                            `css/index.css`
                        )
                        .replace(
                            `/src/sites/${routeName}/index.ts`,
                            `js/index.js`
                        )
                        .replace(
                            new RegExp(`/src/sites/${routeName}/img`, "g"),
                            "img"
                        );

                    pugFiles.forEach((pugFileName) => {
                        const pugFilePath = path.join(routeDir, pugFileName);
                        const pugFileNameWithoutExt = pugFileName.replace(
                            ".pug",
                            ""
                        );

                        if (
                            fs.existsSync(pugFilePath) &&
                            pugFileName.endsWith(".pug")
                        ) {
                            const tempHtml = finalHtml.replace(
                                new RegExp(
                                    `/${routeName}/${pugFileNameWithoutExt}`,
                                    "g"
                                ),
                                `${pugFileNameWithoutExt}.html`
                            );
                            if (tempHtml) finalHtml = tempHtml;
                        }
                    });

                    finalHtml = finalHtml.replace(
                        new RegExp(`href="/${routeName}/`, "g"),
                        'href="index.html'
                    );

                    // Создаем HTML файл с сохранением структуры папок
                    const htmlFilePath = path.join(
                        routeName,
                        pugFileName.replace(".pug", ".html")
                    );

                    this.emitFile({
                        type: "asset",
                        fileName: htmlFilePath,
                        source: finalHtml,
                    });
                });
            });
        },
    };
}

export { MultiPagePugPlugin };
