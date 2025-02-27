import path from "path";
import { ViteDevServer } from "vite";
import fs from "fs";
import { processPug, processScss, processTS } from "./build";
import { handlePugMiddleware, setupWatcher } from "./serve";

const ROOT_DIR = path.resolve(__dirname, "../");

function MultiPagePugPlugin() {
    return {
        name: "vite:multipage-pug",

        configureServer(server: ViteDevServer) {
            // Подключаем middleware для обработки Pug-файлов
            server.middlewares.use(handlePugMiddleware);

            // Настраиваем наблюдатель за изменениями файлов
            setupWatcher(server);
        },

        generateBundle: async function (_options, bundle) {
            const sitesDir = path.resolve(ROOT_DIR, "src", "sites");
            const dirs = fs.readdirSync(sitesDir, { withFileTypes: true });

            const promises = [];

            dirs.forEach((dirEnt) => {
                if (!dirEnt.isDirectory()) return;

                const siteName = dirEnt.name;
                if (siteName === "clean-site") return;

                const siteDir = path.join(sitesDir, siteName);

                processScss.call(this, { siteName, siteDir });
                processTS.call(this, { siteName, siteDir });

                promises.push(
                    processPug({
                        siteName,
                        siteDir,
                        emitFile: this.emitFile.bind(this),
                    }).catch((err) => {
                        console.error(
                            `Ошибка обработки Pug для ${siteName}:`,
                            err
                        );
                        throw new Error("Смотри консоль");
                    })
                );
            });

            await Promise.all(promises);
        },
    };
}

export { MultiPagePugPlugin };
