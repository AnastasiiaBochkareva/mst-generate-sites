import fs, { cpSync } from "fs";
import path from "path";
import type { Plugin } from "vite";

function copyFiles(): Plugin {
    return {
        name: "copy-files-plugin",

        closeBundle() {
            const pagesDir = path.resolve(__dirname, "src", "sites");
            const additionalDir = path.resolve(__dirname, "src", "additional");

            const pages = fs
                .readdirSync(pagesDir, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);

            pages.forEach((page) => {
                const foldersForCopyies = ["img", "fonts"];

                foldersForCopyies.forEach((folderName) => {
                    const srcDir = path.resolve(pagesDir, page, folderName);
                    if (fs.existsSync(srcDir)) {
                        const outDir = path.resolve(
                            __dirname,
                            "dist",
                            page,
                            folderName
                        );
                        cpSync(srcDir, outDir, { recursive: true });
                        console.log(
                            `Copied files in "${folderName}" for page "${page}" to ${outDir}`
                        );
                    }
                });

                const excludeFiles = ["index.php", "robots.txt", "sitemap.xml"];
                const outDir = path.resolve(__dirname, "dist", page);
                if (fs.existsSync(additionalDir)) {
                    // Копирует все файлы директории additionalDir, без рекурсивности, исключая excludeFiles
                    fs.readdirSync(additionalDir).forEach((file) => {
                        if (!excludeFiles.includes(file)) {
                            const srcPath = path.join(additionalDir, file);
                            const destPath = path.join(outDir, file);
                            cpSync(srcPath, destPath, { recursive: true });
                        }
                    });

                    console.log(
                        `Copied files from additional folder for page "${page}" to ${outDir}, excluding ${excludeFiles.join(
                            ", "
                        )}`
                    );
                }
            });
        },
    };
}

export { copyFiles };
