import { spawn } from "node:child_process";
import { log } from "./logger.js";
import { t } from "./i18n.js";
export function startEmulator(emulatorPath, avdName) {
    log.info(t.startingEmulator(avdName));
    log.info(t.startingBackground);
    // UNCパスエラー回避のため cwd を /mnt/c に設定
    const child = spawn(emulatorPath, ["-avd", avdName], {
        cwd: "/mnt/c",
        detached: true,
        stdio: "ignore",
    });
    child.unref();
    log.success(t.emulatorStarted);
}
//# sourceMappingURL=start-emulator.js.map