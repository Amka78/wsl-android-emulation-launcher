import { execFileSync } from "node:child_process";
import { log } from "./logger.js";
import { t } from "./i18n.js";

const MAX_WAIT_MS = 60_000;
const POLL_INTERVAL_MS = 2_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForAdbConnection(adbPath: string): Promise<string[]> {
  log.info(t.waitingAdb);

  const startTime = Date.now();

  while (Date.now() - startTime < MAX_WAIT_MS) {
    try {
      const output = execFileSync(adbPath, ["devices"], {
        encoding: "utf-8",
        timeout: 5000,
        stdio: ["pipe", "pipe", "pipe"],
      });

      const serials = output
        .split("\n")
        .map((l) => l.replace(/\r/g, "").trim())
        .filter((l) => /^[^\s]+\s+device$/.test(l))
        .map((l) => l.split(/\s+/)[0]);

      if (serials.length > 0) {
        console.error("");
        log.success(t.adbConnected);
        console.error("");
        log.info(t.connectedDevices);
        console.error(output.replace(/\r/g, ""));
        return serials;
      }
    } catch {
      // adb がまだ起動中の場合は無視
    }

    process.stderr.write(".");
    await sleep(POLL_INTERVAL_MS);
  }

  console.error("");
  log.warn(t.timeout);
  log.info(t.manualCheck(adbPath));
  return [];
}
