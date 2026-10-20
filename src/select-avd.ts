import prompts from "prompts";
import { log } from "./logger.js";
import { t } from "./i18n.js";

export interface AvdSelectionOptions {
  avd?: string;
}

export function printAvdList(avds: string[]): void {
  console.error(t.availableAvds);
  console.error("----------------------------------------");
  for (const [i, avd] of avds.entries()) {
    console.error(`  ${i + 1}) ${avd}`);
  }
  console.error("----------------------------------------");
}

/**
 * AVDを選択する。--avd指定・単一AVD・対話選択の順で解決する。
 * キャンセル・不正指定時は null を返す（エラーメッセージはログ済み）。
 */
export async function selectAvdName(
  avds: string[],
  options: AvdSelectionOptions,
): Promise<string | null> {
  if (options.avd) {
    if (!avds.includes(options.avd)) {
      log.error(t.avdNotFound(options.avd));
      log.info(t.available(avds.join(", ")));
      return null;
    }
    return options.avd;
  }

  if (avds.length === 1) {
    log.info(t.autoSelected);
    return avds[0];
  }

  console.error("");
  printAvdList(avds);
  console.error("");

  const response = await prompts({
    type: "select",
    name: "avd",
    message: t.selectAvd,
    choices: avds.map((avd) => ({ title: avd, value: avd })),
  });

  if (!response.avd) {
    log.error(t.selectionCancelled);
    return null;
  }

  return response.avd;
}