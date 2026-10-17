/**
 * WSLパス (/mnt/c/...) を Windowsパス (C:\...) に変換
 */
export declare function wslToWindowsPath(wslPath: string): string;
/**
 * Windowsのユーザー名を取得（/mnt/c/Users/ を走査、失敗時は cmd.exe にフォールバック）
 */
export declare function getWindowsUsername(): string | null;
//# sourceMappingURL=path-utils.d.ts.map