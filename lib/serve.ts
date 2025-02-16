import fs from 'fs'
import path from 'path'
import { getConfig, ROOT_DIR } from './_index'
import { ViteDevServer } from 'vite'
import pug from "pug";

function servePugFile(
  pugFilePath: string,
  res: any,
  next: Function,
  data: any
): boolean {
  if (!fs.existsSync(pugFilePath)) {
    return false;
  }
  const stats = fs.statSync(pugFilePath);
  if (!stats.isFile()) {
    return false;
  }

  try {
    const pugCode = fs.readFileSync(pugFilePath, "utf-8");
    const compiledFn = pug.compile(pugCode, {
      filename: pugFilePath,
      basedir: path.resolve(ROOT_DIR, "src"),
      pretty: true,
    });
    let html = compiledFn(data);

    // Если в HTML нет подключения Vite, добавляем его
    if (!html.includes("/@vite/client")) {
      if (html.includes("</head>")) {
        html = html.replace(
          "</head>",
          `<script type="module" src="/@vite/client"></script></head>`
        );
      } else if (html.includes("</body>")) {
        html = html.replace(
          "</body>",
          `<script type="module" src="/@vite/client"></script></body>`
        );
      } else {
        html = `<script type="module" src="/@vite/client"></script>` + html;
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
}

// Middleware для обработки входящих запросов на Pug-страницы
async function handlePugMiddleware(
  req: any,
  res: any,
  next: Function
): Promise<void> {
  const url = req.url?.split("?")[0] || "/";
  const route = url.replace(/^\/|\/$/g, "");

  if (route === "") {
    // Обрабатываем корневой запрос, отрисовываем index.pug
    const sitesDir = path.resolve(ROOT_DIR, "src", "sites");
    const dirs = fs.readdirSync(sitesDir, { withFileTypes: true });
    const siteNames = dirs
      .map((dir) => dir.name)
      .filter((dir) => dir != 'clean-site')
    const rootPug = path.resolve(ROOT_DIR, "src", "index.pug");
    const served = servePugFile(rootPug, res, next, { siteName: "", siteNames: siteNames });
    if (served) return;
    return next();
  }

  const [nameOfSite, nameOfPageInSite] = route.split("/");

  if (nameOfPageInSite) {
    // Заменяем расширение .html на .pug
    const replaceHtmlToPug = nameOfPageInSite.replace(".html", ".pug");
    const siteDir = path.resolve(ROOT_DIR, "src", "sites", nameOfSite)
    const pagePug = path.resolve(siteDir, "pages", replaceHtmlToPug);
    try {
      const config = await getConfig(siteDir)

      const served = servePugFile(pagePug, res, next, { siteName: nameOfSite, config });
      if (served) return;
    } catch (err) {
      // Если произошла ошибка, передаем дальше
    }
    return next();
  }

  return next();
}

// Функция для настройки наблюдателя за изменениями файлов
function setupWatcher(server: ViteDevServer) {
  const watcher = server.watcher;

  watcher.add("src/**/*.pug");
  watcher.add("src/**/*.ts");
  watcher.add("src/**/*.js");
  watcher.add("src/**/*.scss");

  watcher.on("change", (file) => {
    if (
      file.endsWith(".pug") ||
      file.endsWith(".scss") ||
      file.endsWith(".ts") ||
      file.endsWith(".js")
    ) {
      // console.log(`[WATCHER] Изменён файл: ${file}`);
      server.ws.send({ type: "full-reload", path: "*" });
    }
  });
}

export {
  servePugFile,
  handlePugMiddleware,
  setupWatcher,
}