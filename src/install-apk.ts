import { execFileSync } from "node:child_process";
import { log } from "./logger.js";
import { t } from "./i18n.js";

/**
 * 接続済みデバイスへ APK をインストールする。
 * -r: 既存アプリを置き換え、-d: バージョンコードのダウングレードを許可
 */
export function installApkToDevices(
  adbPath: string,
  serials: string[],
  apkWindowsPath: string,
): boolean {
  let success = true;

  for (const serial of serials) {
    try {
      execFileSync(
        adbPath,
        ["-s", serial, "install", "-r", "-d", apkWindowsPath],
        {
          encoding: "utf-8",
          timeout: 120_000,
          stdio: ["pipe", "pipe", "pipe"],
        },
      );
      log.success(t.apkInstalledTo(serial));
    } catch (err) {
      log.error(t.apkInstallFailed(serial, apkWindowsPath, err));
      success = false;
    }
  }

  return success;
}