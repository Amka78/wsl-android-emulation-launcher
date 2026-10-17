import { execFileSync } from "node:child_process";
import { log } from "./logger.js";
import { t } from "./i18n.js";
export function listAvds(emulatorPath) {
    log.info(t.searchingAvds);
    try {
        const output = execFileSync(emulatorPath, ["-list-avds"], {
            encoding: "utf-8",
            timeout: 10000,
            stdio: ["pipe", "pipe", "pipe"],
        });
        return output
            .split("\n")
            .map((line) => line.replace(/\r/g, "").trim())
            .filter((line) => line.length > 0);
    }
    catch (error) {
        log.error(t.avdListFailed(error));
        return [];
    }
}
//# sourceMappingURL=list-avds.js.map