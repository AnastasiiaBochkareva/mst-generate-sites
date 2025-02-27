import path from "path";
import fs from "fs";
import { ROOT_DIR } from "./_index";
import * as sass from "sass";
import esbuild from "esbuild";
import { pathToFileURL } from "url";
import pug from "pug";

interface IProcessProps {
    siteName: string;
    siteDir: string;
    emitFile?: (params: {
        type: string;
        fileName: string;
        source: string;
    }) => void;
}

function processScss({ siteName, siteDir }: IProcessProps) {
    const scssFile = path.join(siteDir, "index.scss");
    if (!fs.existsSync(scssFile)) return;

    try {
        const aliasImporter = (url: string) => {
            if (url.startsWith("@/")) {
                const newUrl = path.resolve(ROOT_DIR, "src", url.substr(2));
                return { file: newUrl };
            }
            return null;
        };

        const scssResult = sass.renderSync({
            file: scssFile,
            importer: aliasImporter,
        });
        let cssOutput = scssResult.css.toString();
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
        console.error(`Ошибка компиляции SCSS для ${siteName}:`, err);
        throw new Error("Смотри консоль");
    }
}

function processTS({ siteName, siteDir }: IProcessProps) {
    const tsFile = path.join(siteDir, "index.ts");
    if (!fs.existsSync(tsFile)) return;

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
        if (result.outputFiles && result.outputFiles.length > 0) {
            const jsOutput = result.outputFiles[0].text;
            this.emitFile({
                type: "asset",
                fileName: `${siteName}/js/index.js`,
                source: jsOutput,
            });
        }
    } catch (err) {
        console.error(`Ошибка компиляции TS для ${siteName}:`, err);
        throw new Error("Смотри консоль");
    }
}

async function processPug({ siteName, siteDir, emitFile }: IProcessProps) {
    const pagesDir = path.join(siteDir, "pages");
    const configFile = path.join(siteDir, "config.js");
    const files = fs.readdirSync(pagesDir);
    const pugFiles = files.filter((file) => file.endsWith(".pug"));

    let config = null;
    if (fs.existsSync(configFile)) {
        const configFileUrl = pathToFileURL(configFile).href;
        const configData = await import(configFileUrl);
        if (configData.default) config = configData.default;
        console.log(`Данные из ${siteName}/config.ts:`, config);
    }

    pugFiles.forEach((pugFileName) => {
        const pugFilePath = path.join(pagesDir, pugFileName);
        if (!fs.existsSync(pugFilePath)) return;

        const pugCode = fs.readFileSync(pugFilePath, "utf-8");
        const compiledFn = pug.compile(pugCode, {
            filename: pugFilePath,
            basedir: path.resolve(ROOT_DIR, "src"),
            pretty: true,
        });

        const html = compiledFn({ siteName, config });
        let finalHtml = html
            .replace(`/src/sites/${siteName}/index.scss`, `css/index.css`)
            .replace(`/src/sites/${siteName}/index.ts`, `js/index.js`)
            .replace(new RegExp(`/src/sites/${siteName}/img`, "g"), "img");

        // Заменяем ссылки на другие Pug страницы
        pugFiles.forEach((otherPugFileName) => {
            const htmlFileName = otherPugFileName.replace(".pug", ".html");
            finalHtml = finalHtml.replace(
                new RegExp(`/${siteName}/${htmlFileName}`, "g"),
                htmlFileName
            );
        });

        // Вычисляем путь к HTML файлу и эмитим его
        const htmlFilePath = path.join(
            siteName,
            pugFileName.replace(".pug", ".html")
        );
        emitFile?.({
            type: "asset",
            fileName: htmlFilePath,
            source: finalHtml,
        });
    });
}

export { processTS, processScss, processPug };
