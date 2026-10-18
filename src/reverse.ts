import { execFileSync } from "node:child_process";
import { log } from "./logger.js";
import { t } from "./i18n.js";

export const DEFAULT_REVERSE_PORTS = [8081];

export function parseReversePorts(value?: string): number[] {
  if (!value) {
    return DEFAULT_REVERSE_PORTS;
  }

  return value
    .split(",")
    .map((entry) => Number(entry.trim()))
    .filter((port) => Number.isInteger(port) && port > 0 && port <= 65535);
}

export function applyReverseForwards(
  adbPath: string,
  serials: string[],
  ports: number[],
): boolean {
  let success = true;

  for (const serial of serials) {
    for (const port of ports) {
      try {
        execFileSync(
          adbPath,
          ["-s", serial, "reverse", `tcp:${port}`, `tcp:${port}`],
          {
            encoding: "utf-8",
            timeout: 5000,
            stdio: ["pipe", "pipe", "pipe"],
          },
        );
        log.success(t.reverseApplied(serial, port));
      } catch (err) {
        log.warn(t.reverseFailed(serial, port, err));
        success = false;
      }
    }
  }

  return success;
}
