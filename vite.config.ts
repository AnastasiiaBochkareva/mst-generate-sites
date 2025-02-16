import { defineConfig } from "vite";
import path from "path";
import { MultiPagePugPlugin } from "./lib/vite-multi-page";
import { copyFiles } from "./lib/vite-copy-files";

export default defineConfig({
    plugins: [MultiPagePugPlugin(), copyFiles()],

    server: {
        watch: {
            ignored: ["**/.git/**", "**/node_modules/**"],
        },
    },

    css: {
        preprocessorOptions: {
            scss: {
                includePaths: [path.resolve(__dirname, "src")],
            } as any,
        },
    },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
