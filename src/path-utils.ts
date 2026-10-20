import { execSync, execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";

/**
 * WSLパス (/mnt/c/...) を Windowsパス (C:\...) に変換
 */
export function wslToWindowsPath(wslPath: string): string {
  const match = wslPath.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (!match) return wslPath;

  const drive = match[1].toUpperCase();
  const rest = match[2].replace(/\//g, "\\");
  return `${drive}:\\${rest}`;
}

/**
 * WSLパスをWindowsプロセス(adb.exe等)が開けるパスに変換する
 * - /mnt/<drive>/... → <DRIVE>:\... （Windows側から直接読める）
 * - WSL内部パス     → \\wsl.localhost の UNC パス（wslpath -w で変換）
 * - 既にWindowsパス  → そのまま
 */
export function toWindowsAccessiblePath(wslPath: string): string {
  if (/^[a-zA-Z]:[\\/]/.test(wslPath) || /^\\\\/.test(wslPath)) {
    return wslPath;
  }

  const mntMatch = wslPath.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (mntMatch) {
    return `${mntMatch[1].toUpperCase()}:\\${mntMatch[2].replace(/\//g, "\\")}`;
  }

  try {
    return execFileSync("wslpath", ["-w", wslPath], {
      encoding: "utf-8",
    }).trim();
  } catch {
    // wslpath が使えない場合は元のパスを返す
    return wslPath;
  }
}

/**
 * Windowsのユーザー名を取得（/mnt/c/Users/ を走査、失敗時は cmd.exe にフォールバック）
 */
export function getWindowsUsername(): string | null {
  // 方法1: /mnt/c/Users/ の最初のディレクトリを取得（高速）
  try {
    const usersDir = "/mnt/c/Users";
    const entries = readdirSync(usersDir, { withFileTypes: true });
    const userDir = entries.find(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "Public" &&
        entry.name !== "Default" &&
        entry.name !== "Default User" &&
        entry.name !== "All Users",
    );
    if (userDir) {
      return userDir.name;
    }
  } catch {
    // フォールバック
  }

  // 方法2: cmd.exe で取得（遅いが確実）
  try {
    return execSync('cmd.exe /c "echo %USERNAME%"', {
      encoding: "utf-8",
      timeout: 5000,
    }).trim();
  } catch {
    return null;
  }
}
