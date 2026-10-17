#!/usr/bin/env node

import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import prompts from "prompts";
import { Command } from "commander";
import { log } from "./logger.js";
import { wslToWindowsPath } from "./path-utils.js";
import { detectAndroidSdk } from "./detect-sdk.js";
import { listAvds } from "./list-avds.js";
import { startEmulator } from "./start-emulator.js";
import { waitForAdbConnection } from "./wait-adb.js";
import { installProxies, checkPathSetup } from "./install-proxy.js";
import { t } from "./i18n.js";

const program = new Command();

program
  .name("wsl-android-emulation-launcher")
  .description(
    "Launch Android emulators from WSL with ADB connection support",
  )
  .version("1.0.0")
  .option("--avd <name>", "specify AVD name (skip interactive selection)")
  .option("--no-wait", "skip ADB connection wait")
  .option("--list", "list available AVDs and exit")
  .option("--export-env", "print ANDROID_HOME export command (for eval)")
  .option(
    "--install-proxy",
    "install adb/emulator proxy scripts to ~/.local/bin",
  )
  .parse(process.argv);

const opts = program.opts();

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
    const success = installProxies(sdk.adb, sdk.emulator);
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

  // 2. AVD一覧取得
  const avds = listAvds(sdk.emulator);

  if (avds.length === 0) {
    log.error(t.noAvds);
    log.info(t.createAvdInManager);
    process.exit(1);
  }

  // --list: 一覧表示のみ
  if (opts.list) {
    console.error(t.availableAvds);
    console.error("----------------------------------------");
    for (const [i, avd] of avds.entries()) {
      console.error(`  ${i + 1}) ${avd}`);
    }
    console.error("----------------------------------------");
    process.exit(0);
  }

  // 3. AVD選択
  let selectedAvd: string;

  if (opts.avd) {
    if (!avds.includes(opts.avd)) {
      log.error(t.avdNotFound(opts.avd));
      log.info(t.available(avds.join(", ")));
      process.exit(1);
    }
    selectedAvd = opts.avd;
  } else if (avds.length === 1) {
    log.info(t.autoSelected);
    selectedAvd = avds[0];
  } else {
    console.error(t.availableAvds);
    console.error("----------------------------------------");
    for (const [i, avd] of avds.entries()) {
      console.error(`  ${i + 1}) ${avd}`);
    }
    console.error("----------------------------------------");
    console.error("");

    const response = await prompts({
      type: "select",
      name: "avd",
      message: t.selectAvd,
      choices: avds.map((avd) => ({ title: avd, value: avd })),
    });

    if (!response.avd) {
      log.error(t.selectionCancelled);
      process.exit(1);
    }
    selectedAvd = response.avd;
  }

  console.error("");
  log.info(t.selectedAvd(selectedAvd));
  console.error("");

  // 4. エミュレーター起動
  startEmulator(sdk.emulator, selectedAvd);

  // 5. ADB接続待機
  if (opts.wait !== false) {
    console.error("");
    await waitForAdbConnection(sdk.adb);
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
