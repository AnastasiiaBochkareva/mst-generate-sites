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
                const stats = fs.statSync(pugFilePath);
                if (!stats.isFile()) {
                    return false;
                }
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

                if (route === "") {
                    const rootPug = path.resolve(__dirname, "src", "index.pug");
                    const served = servePugFile(rootPug, res, next, {
                        siteName: "",
                    });
                    if (served) return;
                    return next();
                }

                const lastPart = route.split("/");
                const nameOfSite = lastPart[0]; // the name of site in sites folder
                const nameOfPageInSite = lastPart[1]; // name of pages in sites folder ~ index.html || services.html

                if (nameOfPageInSite) {
                    const replaceHtmlToPug = nameOfPageInSite.replace(
                        ".html",
                        ".pug"
                    );

                    const pagePug = path.resolve(
                        __dirname,
                        "src",
                        "sites",
                        nameOfSite,
                        "pages",
                        `${replaceHtmlToPug}` // index.pug || services.pug
                    );
                    try {
                        const served = servePugFile(pagePug, res, next, {
                            siteName: nameOfSite,
                        });
                        if (served) return;
                    } catch (err) {
                        // console.log("err :>> ", err);
                    }
                    return next();
                }

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
                    server.ws.send({ type: "full-reload", path: "*" });
                }
            });
        },

        generateBundle(_options, bundle) {
            const sitesDir = path.resolve(__dirname, "src", "sites");
            const dirs = fs.readdirSync(sitesDir, { withFileTypes: true });

            dirs.forEach((dirEnt) => {
                if (!dirEnt.isDirectory()) return;

                const siteName = dirEnt.name;
                const siteDir = path.join(sitesDir, siteName);
                const pagesDir = path.join(siteDir, "pages");
                const files = fs.readdirSync(pagesDir);

                const pugFiles = files.filter((file) => file.endsWith(".pug"));
                const scssFile = path.join(sitesDir, siteName, "index.scss");
                const tsFile = path.join(sitesDir, siteName, "index.ts");
                const textTsFile = path.join(sitesDir, siteName, "text.ts");

                if (fs.existsSync(textTsFile)) {
                    // Используем require для динамической загрузки данных
                    const textModule = require(textTsFile);
                    const itemsFAQ = textModule.itemsFAQ || [];
                    console.log("itemsFAQ :>> ", itemsFAQ);
                }

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
                            new RegExp(`@/sites/${siteName}/`, "g"),
                            "../"
                        );
                        this.emitFile({
                            type: "asset",
                            fileName: `${siteName}/css/index.css`,
                            source: cssOutput,
                        });
                    } catch (err) {
                        console.error(
                            `Ошибка компиляции SCSS для ${siteName}:`,
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
                                fileName: `${siteName}/js/index.js`,
                                source: jsOutput,
                            });
                        }
                    } catch (err) {
                        console.error(
                            `Ошибка компиляции TS для ${siteName}:`,
                            err
                        );
                    }
                }

                // проходимя по каждому pug чтобы каждый pug обработать pug npm пакетом
                pugFiles.forEach((pugFileName) => {
                    const pugFilePath = path.join(
                        siteDir,
                        "pages",
                        pugFileName
                    );

                    if (!fs.existsSync(pugFilePath)) return;

                    // Считываем содержимое Pug файла
                    const pugCode = fs.readFileSync(pugFilePath, "utf-8");

                    // Компиляция Pug файла
                    const compiledFn = pug.compile(pugCode, {
                        filename: pugFilePath,
                        basedir: path.resolve(__dirname, "src"),
                        pretty: true,
                    });

                    const { itemsFAQ } = require(textTsFile);
                    const options = {
                        siteName: siteName,
                    };

                    if (itemsFAQ) console.log("itemsFAQ :>> ", itemsFAQ);

                    // Создаем HTML контент
                    const html = compiledFn(options);

                    // Модификация ссылок в HTML на стили, typescript && images
                    let finalHtml = html
                        .replace(
                            `/src/sites/${siteName}/index.scss`,
                            `css/index.css`
                        )
                        .replace(
                            `/src/sites/${siteName}/index.ts`,
                            `js/index.js`
                        )
                        .replace(
                            new RegExp(`/src/sites/${siteName}/img`, "g"),
                            "img"
                        );

                    // проходимся по каждой странице pug чтобы поменять все ссылки на другие страницы pug
                    pugFiles.forEach((pugFileName) => {
                        const pugFilePath = path.join(
                            siteDir,
                            "pages",
                            pugFileName
                        );
                        const pugFileNameHtmlExtension = pugFileName.replace(
                            ".pug",
                            ".html"
                        );

                        if (
                            fs.existsSync(pugFilePath) &&
                            pugFileName.endsWith(".pug")
                        ) {
                            const tempHtml = finalHtml.replace(
                                new RegExp(
                                    `/${siteName}/${pugFileNameHtmlExtension}`,
                                    "g"
                                ),
                                `${pugFileNameHtmlExtension}`
                            );
                            if (tempHtml) finalHtml = tempHtml;
                        }
                    });

                    // Создаем HTML файл с сохранением структуры папок
                    const htmlFilePath = path.join(
                        siteName,
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
