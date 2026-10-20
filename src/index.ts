#!/usr/bin/env node

import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { log } from "./logger.js";
import { wslToWindowsPath, toWindowsAccessiblePath } from "./path-utils.js";
import { detectAndroidSdk, AndroidSdkPaths } from "./detect-sdk.js";
import { listAvds } from "./list-avds.js";
import { startEmulator } from "./start-emulator.js";
import {
  waitForAdbConnection,
  getConnectedSerials,
} from "./wait-adb.js";
import { applyReverseForwards, parseReversePorts } from "./reverse.js";
import { installProxies, checkPathSetup } from "./install-proxy.js";
import { selectAvdName, printAvdList } from "./select-avd.js";
import { installApkToDevices } from "./install-apk.js";
import { t } from "./i18n.js";

const pkgVersion = JSON.parse(
  readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), "../package.json"),
    "utf-8",
  ),
).version as string;

const program = new Command();

program
  .name("wsl-avd")
  .description(
    "Launch Android emulators from WSL with ADB connection support",
  )
  .version(pkgVersion)
  .option("--avd <name>", "specify AVD name (skip interactive selection)")
  .option("--no-wait", "skip ADB connection wait")
  .option(
    "--reverse <ports>",
    "comma-separated ports to adb reverse (default: 8081)",
  )
  .option("--skip-reverse", "skip adb reverse setup")
  .option("--list", "list available AVDs and exit")
  .option("--export-env", "print ANDROID_HOME export command (for eval)")
  .option(
    "--install-proxy",
    "install adb/emulator proxy scripts to ~/.local/bin",
  )
  .option(
    "--install <apk>",
    "install a locally built APK to the emulator",
  )
  .parse(process.argv);

const opts = program.opts();

type CliOptions = ReturnType<typeof program.opts>;

/**
 * --install: ローカルビルドしたAPKをエミュレーターにインストールする
 * デバイス未接続時は AVD選択 → 起動 → ADB接続待機を経てインストールする
 */
async function runInstallAsync(
  sdk: AndroidSdkPaths,
  cliOpts: CliOptions,
): Promise<void> {
  const apkPath = String(cliOpts.install);

  if (!apkPath.toLowerCase().endsWith(".apk")) {
    log.error(t.apkNotApk(apkPath));
    process.exit(1);
  }
  if (!existsSync(apkPath)) {
    log.error(t.apkNotFound(apkPath));
    process.exit(1);
  }

  let serials = getConnectedSerials(sdk.adb);

  // 未接続ならエミュレーターを起動して接続を待つ
  if (serials.length === 0) {
    console.error("");
    log.info(t.noDeviceConnected);

    const avds = listAvds(sdk.emulator);
    if (avds.length === 0) {
      log.error(t.noAvds);
      log.info(t.createAvdInManager);
      process.exit(1);
    }

    console.error("");
    const selectedAvd = await selectAvdName(avds, cliOpts);
    if (!selectedAvd) {
      process.exit(1);
    }

    console.error("");
    log.info(t.selectedAvd(selectedAvd));
    console.error("");

    startEmulator(sdk.emulator, selectedAvd);

    console.error("");
    serials = await waitForAdbConnection(sdk.adb);
  }

  if (serials.length === 0) {
    log.error(t.noDeviceForInstall);
    process.exit(1);
  }

  // Metro 等への接続用に adb reverse を設定（--skip-reverse で無効化可）
  if (!cliOpts.skipReverse) {
    const ports = parseReversePorts(cliOpts.reverse);

    console.error("");
    if (ports.length === 0) {
      log.warn(t.invalidReversePorts(String(cliOpts.reverse)));
    } else {
      log.info(t.settingUpReverse(serials.length, ports.join(", ")));
      applyReverseForwards(sdk.adb, serials, ports);
    }
  }

  console.error("");
  log.info(t.installingApk(apkPath));
  const apkWindowsPath = toWindowsAccessiblePath(apkPath);
  log.info(t.apkWindowsPath(apkWindowsPath));

  const success = installApkToDevices(sdk.adb, serials, apkWindowsPath);

  console.error("");
  if (success) {
    log.success(t.apkInstalled);
  } else {
    log.error(t.apkSomeFailed);
    process.exit(1);
  }
}

async function main() {
  // .env を読み込む（プロジェクトルートから）
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const possibleRoots = [
    resolve(currentDir, "../../.."), // dist/ → tools/pkg/ → project root
    resolve(currentDir, "../.."),
    process.cwd(),
  ];

  for (const root of possibleRoots) {
    const envPath = resolve(root, ".env");
    if (existsSync(envPath)) {
      config({ path: envPath });
      break;
    }
  }

  // 1. SDK検出
  const sdk = detectAndroidSdk();
  if (!sdk) {
    log.error(t.sdkNotFound);
    log.info(t.setAndroidHome);
    log.info(t.exampleEnv);
    process.exit(1);
  }

  // --export-env: 環境変数 export コマンドを出力して終了（eval 用）
  if (opts.exportEnv) {
    console.log(t.exportEnvCommand(sdk.sdkRoot));
    process.exit(0);
  }

  // --install-proxy: adb/emulator プロキシを ~/.local/bin にインストール
  if (opts.installProxy) {
    const success = installProxies(sdk.adb, sdk.emulator, sdk.sdkRoot);
    if (success) {
      checkPathSetup();
      process.exit(0);
    } else {
      process.exit(1);
    }
  }

  console.error("");
  console.error("==========================================");
  console.error(t.header);
  console.error("==========================================");
  console.error("");

  log.success(t.sdkDetected(sdk.sdkRoot));
  log.info(t.windowsPath(wslToWindowsPath(sdk.sdkRoot)));
  log.success(t.adbPath(wslToWindowsPath(sdk.adb)));
  log.success(t.emulatorPath(wslToWindowsPath(sdk.emulator)));
  log.info(t.androidHomeAutoSet(sdk.sdkRoot));
  console.error("");

  // --install: ローカルビルドしたAPKをエミュレーターにインストール
  if (opts.install) {
    await runInstallAsync(sdk, opts);
    return;
  }

  // 2. AVD一覧取得
  const avds = listAvds(sdk.emulator);

  if (avds.length === 0) {
    log.error(t.noAvds);
    log.info(t.createAvdInManager);
    process.exit(1);
  }

  // --list: 一覧表示のみ
  if (opts.list) {
    printAvdList(avds);
    process.exit(0);
  }

  // 3. AVD選択
  const selectedAvd = await selectAvdName(avds, opts);
  if (!selectedAvd) {
    process.exit(1);
  }

  console.error("");
  log.info(t.selectedAvd(selectedAvd));
  console.error("");

  // 4. エミュレーター起動
  startEmulator(sdk.emulator, selectedAvd);

  // 5. ADB接続待機
  let connectedDevices: string[] = [];

  if (opts.wait !== false) {
    console.error("");
    connectedDevices = await waitForAdbConnection(sdk.adb);
  }

  // 6. adb reverse 設定（Expo Go / Metro を localhost 経由で接続できるようにする）
  if (!opts.skipReverse && connectedDevices.length > 0) {
    const ports = parseReversePorts(opts.reverse);

    console.error("");
    if (ports.length === 0) {
      log.warn(t.invalidReversePorts(String(opts.reverse)));
    } else {
      log.info(t.settingUpReverse(connectedDevices.length, ports.join(", ")));
      applyReverseForwards(sdk.adb, connectedDevices, ports);
    }
  }

  console.error("");
  console.error("==========================================");
  log.success(t.setupComplete);
  console.error("==========================================");
  console.error("");
  log.info(t.runReactNative);
  console.error("  bun run android");
  console.error("");
  log.info(t.exportAndroidHomeHint(sdk.sdkRoot));
  console.error("");
}

main().catch((error) => {
  log.error(t.unexpectedError(error));
  process.exit(1);
});
