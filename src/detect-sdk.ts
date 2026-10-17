import { existsSync } from "node:fs";
import { join } from "node:path";
import { log } from "./logger.js";
import { getWindowsUsername } from "./path-utils.js";
import { t } from "./i18n.js";

export interface AndroidSdkPaths {
  sdkRoot: string;
  emulator: string;
  adb: string;
}

const DEFAULT_SEARCH_PATHS = [
  "/mnt/c/Android/Sdk",
  "/mnt/c/Program Files/Android/Sdk",
];

export function detectAndroidSdk(): AndroidSdkPaths | null {
  let sdkRoot: string | null = null;

  // 1. 環境変数から取得
  if (process.env.ANDROID_HOME && existsSync(process.env.ANDROID_HOME)) {
    sdkRoot = process.env.ANDROID_HOME;
  } else if (
    process.env.ANDROID_SDK_ROOT &&
    existsSync(process.env.ANDROID_SDK_ROOT)
  ) {
    sdkRoot = process.env.ANDROID_SDK_ROOT;
  }

  // 2. デフォルトパスを検索
  if (!sdkRoot) {
    const username = getWindowsUsername();
    if (username) {
      const userPath = `/mnt/c/Users/${username}/AppData/Local/Android/Sdk`;
      if (existsSync(userPath)) {
        sdkRoot = userPath;
      }
    }
  }

  if (!sdkRoot) {
    for (const p of DEFAULT_SEARCH_PATHS) {
      if (existsSync(p)) {
        sdkRoot = p;
        break;
      }
    }
  }

  if (!sdkRoot || !existsSync(sdkRoot)) {
    return null;
  }

  const emulator = join(sdkRoot, "emulator", "emulator.exe");
  const adb = join(sdkRoot, "platform-tools", "adb.exe");

  if (!existsSync(emulator)) {
    log.error(t.emulatorNotFound(emulator));
    return null;
  }

  if (!existsSync(adb)) {
    log.error(t.adbNotFound(adb));
    return null;
  }

  return { sdkRoot, emulator, adb };
}
