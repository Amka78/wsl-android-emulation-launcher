import chalk from "chalk";

const prefix = {
  ja: { info: "情報", success: "成功", warn: "警告", error: "エラー" },
  zh: { info: "信息", success: "成功", warn: "警告", error: "错误" },
  en: { info: "INFO", success: "SUCCESS", warn: "WARN", error: "ERROR" },
}[
  (process.env.LANG || process.env.LANGUAGE || "").startsWith("zh")
    ? "zh"
    : (process.env.LANG || process.env.LANGUAGE || "").startsWith("ja")
      ? "ja"
      : "en"
];

export const log = {
  info: (msg: string) =>
    console.error(chalk.blue(`[${prefix.info}]`) + " " + msg),
  success: (msg: string) =>
    console.error(chalk.green(`[${prefix.success}]`) + " " + msg),
  warn: (msg: string) =>
    console.error(chalk.yellow(`[${prefix.warn}]`) + " " + msg),
  error: (msg: string) =>
    console.error(chalk.red(`[${prefix.error}]`) + " " + msg),
};
