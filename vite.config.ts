import { defineConfig } from "vite";
import path from "path";
import { MultiPagePugPlugin } from "./vite-multi-page";
import { copyImagesPlugin } from "./vite-copy-files";

export default defineConfig({
    plugins: [MultiPagePugPlugin(), copyImagesPlugin()],

    server: {
        watch: {
            ignored: ["**/.git/**", "**/node_modules/**"],
        },
    },

    css: {
        preprocessorOptions: {
            scss: {
                api: "legacy",
                includePaths: [path.resolve(__dirname, "src")],
            },
        },
    },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
