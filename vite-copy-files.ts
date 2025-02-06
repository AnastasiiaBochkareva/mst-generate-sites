import fs, { cpSync } from "fs";
import path from "path";
import type { Plugin } from "vite";

function copyImagesPlugin(): Plugin {
    return {
        name: "copy-files-plugin",

        closeBundle() {
            // создание переменной, которая хранит в себе путь к папке src/sites
            const pagesDir = path.resolve(__dirname, "src", "sites");

            const pages = fs
                .readdirSync(pagesDir, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);

            pages.forEach((page) => {
                const srcImgDir = path.resolve(pagesDir, page, "img");
                if (fs.existsSync(srcImgDir)) {
                    const outImgDir = path.resolve(
                        __dirname,
                        "dist",
                        page,
                        "img"
                    );
                    cpSync(srcImgDir, outImgDir, { recursive: true });
                    console.log(
                        `Copied images for page "${page}" to ${outImgDir}`
                    );
                }

                const srcFontsDir = path.resolve(pagesDir, page, "fonts");
                if (fs.existsSync(srcFontsDir)) {
                    const outFontsDir = path.resolve(
                        __dirname,
                        "dist",
                        page,
                        "fonts"
                    );
                    cpSync(srcFontsDir, outFontsDir, { recursive: true });
                    console.log(
                        `Copied fonts for page "${page}" to ${outFontsDir}`
                    );
                }
            });
        },
    };
}

export { copyImagesPlugin };
