import path from 'path'
import fs from 'fs'
import { pathToFileURL } from 'url'

const ROOT_DIR = path.resolve(__dirname, "../");

const getConfig = async (siteDir: string) => {
  try {
    const configFile = path.join(siteDir, "config.js");
    if (fs.existsSync(configFile)) {
      const cacheBuster = `?t=${Date.now()}`;
      const configFileUrl = pathToFileURL(configFile).href + cacheBuster;
      const configData = await import(configFileUrl);
      if (configData.default) {
        return configData.default;
      }
    }
  } catch (err) {
    console.error(`Ошибка получения данных ${siteDir}/config.js"`, err)
  }
  return undefined
}

export { ROOT_DIR, getConfig }