import fs, { cpSync } from "fs";
import path from "path";
import type { Plugin } from "vite";
import { ROOT_DIR } from './_index'

function copyFiles(): Plugin {
    return {
        name: "copy-files-plugin",

        closeBundle() {
            const pagesDir = path.resolve(ROOT_DIR, "src", "sites");
            const additionalDir = path.resolve(ROOT_DIR, "src", "additional");

            const pages = fs
                .readdirSync(pagesDir, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);

            pages.forEach((page) => {
                if (page === "clean-site") return;

                const foldersForCopies = ["img", "fonts"];
                let totalLog = "Success copied files:"

                try {
                    foldersForCopies.forEach((folderName) => {
                        const srcDir = path.resolve(pagesDir, page, folderName);
                        if (fs.existsSync(srcDir)) {
                            const outDir = path.resolve(
                              ROOT_DIR,
                              "dist",
                              page,
                              folderName
                            );
                            cpSync(srcDir, outDir, { recursive: true });
                        }
                    });

                    totalLog += ` in "${foldersForCopies.toString()}"`
                } catch (err) {
                    console.error(err)
                }

                const excludeFiles = ["index.php", "robots.txt", "sitemap.xml"];
                const outDir = path.resolve(ROOT_DIR, "dist", page);
                if (fs.existsSync(additionalDir)) {
                    // Копирует все файлы директории additionalDir, без рекурсивности, исключая excludeFiles
                    fs.readdirSync(additionalDir).forEach((file) => {
                        if (!excludeFiles.includes(file)) {
                            const srcPath = path.join(additionalDir, file);
                            const destPath = path.join(outDir, file);
                            cpSync(srcPath, destPath, { recursive: true });
                        }
                    });

                    totalLog += ` and "additional" files`
                }

                totalLog+= ` for page "${page}" to dist`
                console.warn(totalLog);
            });
        },
    };
}

export { copyFiles };
