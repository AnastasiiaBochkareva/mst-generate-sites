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

                if (fs.existsSync(additionalDir)) {
                    const outDir = path.resolve(__dirname, "dist", page);
                    cpSync(additionalDir, outDir, { recursive: true });
                    console.log(
                        `Copied files from additional folder for page "${page}" to ${outDir}`
                    );
                }
            });
        },
    };
}

export { copyFiles };
