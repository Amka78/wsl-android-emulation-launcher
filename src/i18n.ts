type Lang = "ja" | "zh" | "en";

function detectLang(): Lang {
  const lang = process.env.LANG || process.env.LANGUAGE || "";
  if (lang.startsWith("zh")) return "zh";
  if (lang.startsWith("ja")) return "ja";
  return "en";
}

export const currentLang = detectLang();

const messages = {
  ja: {
    // 共通
    sdkDetected: (path: string) => `Android SDKを検出: ${path}`,
    windowsPath: (path: string) => `Windows SDKパス: ${path}`,
    adbPath: (path: string) => `ADBパス: ${path}`,
    emulatorPath: (path: string) => `Emulatorパス: ${path}`,
    sdkNotFound: "Android SDKが見つかりませんでした",
    setAndroidHome:
      "環境変数 ANDROID_HOME または ANDROID_SDK_ROOT を設定してください",
    exampleEnv: "例: export ANDROID_HOME=/mnt/c/Android/Sdk",
    emulatorNotFound: (path: string) => `emulator.exe が見つかりません: ${path}`,
    adbNotFound: (path: string) => `adb.exe が見つかりません: ${path}`,

    // 環境変数
    androidHomeAutoSet: (path: string) =>
      `ANDROID_HOME を自動設定しました: ${path}`,
    androidHomeWarnNotSet:
      "ANDROID_HOME が未設定です。Expo/React Native 等のツールがエラーになる場合があります",
    exportAndroidHomeHint: (path: string) =>
      `永続化する場合は ~/.bashrc に追加: export ANDROID_HOME=${path}`,
    exportEnvCommand: (path: string) => `export ANDROID_HOME=${path}`,

    // プロキシ
    proxyDirCreated: (dir: string) => `プロキシディレクトリを作成: ${dir}`,
    proxyDirCreateFailed: (dir: string, err: unknown) =>
      `ディレクトリの作成に失敗: ${dir} - ${err}`,
    proxyInstalled: (name: string, path: string) =>
      `${name} プロキシをインストール: ${path}`,
    proxyAlreadyExists: (path: string) =>
      `既に存在します: ${path}`,
    proxyInstallFailed: (err: unknown) =>
      `プロキシのインストールに失敗: ${err}`,
    proxyNotInPath: (dir: string) =>
      `${dir} が PATH に含まれていません`,
    addToBashrc: (dir: string) =>
      `~/.bashrc に以下を追加してください:`,

    // AVD
    searchingAvds: "利用可能なエミュレーターを検索中...",
    avdListFailed: (err: unknown) => `AVD一覧の取得に失敗しました: ${err}`,
    noAvds: "利用可能なエミュレーターが見つかりませんでした",
    createAvdInManager:
      "Windows側でAVD Managerを使用してエミュレーターを作成してください",
    availableAvds: "利用可能なエミュレーター:",
    avdNotFound: (name: string) => `指定されたAVDが見つかりません: ${name}`,
    available: (list: string) => `利用可能: ${list}`,
    autoSelected: "エミュレーターが1つしかないため自動選択します",
    selectAvd: "起動するエミュレーターを選択してください",
    selectionCancelled: "選択がキャンセルされました",
    selectedAvd: (name: string) => `選択されたエミュレーター: ${name}`,

    // 起動
    startingEmulator: (name: string) => `エミュレーターを起動中: ${name}`,
    startingBackground: "バックグラウンドで起動します...",
    emulatorStarted: "エミュレーターの起動コマンドを実行しました",

    // ADB
    waitingAdb: "ADB接続を待機中...",
    adbConnected: "ADB接続完了!",
    connectedDevices: "接続されているデバイス:",
    timeout:
      "タイムアウトしました。エミュレーターの起動に時間がかかっている可能性があります。",
    manualCheck: (cmd: string) => `手動で確認してください: ${cmd} devices`,

    // ADB reverse
    settingUpReverse: (count: number, ports: string) =>
      `ADB reverse を設定中 (${count}台, ポート: ${ports})`,
    reverseApplied: (serial: string, port: number) =>
      `adb reverse 設定: ${serial} tcp:${port} → tcp:${port}`,
    reverseFailed: (serial: string, port: number, err: unknown) =>
      `adb reverse 設定に失敗: ${serial} tcp:${port} - ${err}`,
    invalidReversePorts: (value: string) =>
      `有効なポートが指定されていません: ${value}`,

    // メイン
    header: "Android Emulator 起動スクリプト (WSL → Windows)",
    setupComplete: "セットアップ完了!",
    runReactNative: "React Nativeアプリを起動するには:",
    unexpectedError: (err: unknown) => `予期しないエラー: ${err}`,
  },
  zh: {
    sdkDetected: (path: string) => `已检测到 Android SDK: ${path}`,
    windowsPath: (path: string) => `Windows SDK 路径: ${path}`,
    adbPath: (path: string) => `ADB 路径: ${path}`,
    emulatorPath: (path: string) => `Emulator 路径: ${path}`,
    sdkNotFound: "未找到 Android SDK",
    setAndroidHome: "请设置环境变量 ANDROID_HOME 或 ANDROID_SDK_ROOT",
    exampleEnv: "例如: export ANDROID_HOME=/mnt/c/Android/Sdk",
    emulatorNotFound: (path: string) => `找不到 emulator.exe: ${path}`,
    adbNotFound: (path: string) => `找不到 adb.exe: ${path}`,

    // 环境变量
    androidHomeAutoSet: (path: string) =>
      `已自动设置 ANDROID_HOME: ${path}`,
    androidHomeWarnNotSet:
      "ANDROID_HOME 未设置。Expo/React Native 等工具可能会报错",
    exportAndroidHomeHint: (path: string) =>
      `如需永久设置,请添加到 ~/.bashrc: export ANDROID_HOME=${path}`,
    exportEnvCommand: (path: string) => `export ANDROID_HOME=${path}`,

    // 代理
    proxyDirCreated: (dir: string) => `已创建代理目录: ${dir}`,
    proxyDirCreateFailed: (dir: string, err: unknown) =>
      `创建目录失败: ${dir} - ${err}`,
    proxyInstalled: (name: string, path: string) =>
      `已安装 ${name} 代理: ${path}`,
    proxyAlreadyExists: (path: string) =>
      `已存在: ${path}`,
    proxyInstallFailed: (err: unknown) =>
      `安装代理失败: ${err}`,
    proxyNotInPath: (dir: string) =>
      `${dir} 不在 PATH 中`,
    addToBashrc: (dir: string) =>
      `请将以下内容添加到 ~/.bashrc:`,

    searchingAvds: "正在搜索可用的模拟器...",
    avdListFailed: (err: unknown) => `获取 AVD 列表失败: ${err}`,
    noAvds: "未找到可用的模拟器",
    createAvdInManager: "请在 Windows 端使用 AVD Manager 创建模拟器",
    availableAvds: "可用的模拟器:",
    avdNotFound: (name: string) => `找不到指定的 AVD: ${name}`,
    available: (list: string) => `可用: ${list}`,
    autoSelected: "只有一个模拟器,已自动选择",
    selectAvd: "请选择要启动的模拟器",
    selectionCancelled: "选择已取消",
    selectedAvd: (name: string) => `已选择的模拟器: ${name}`,

    startingEmulator: (name: string) => `正在启动模拟器: ${name}`,
    startingBackground: "将在后台启动...",
    emulatorStarted: "已执行模拟器启动命令",

    waitingAdb: "正在等待 ADB 连接...",
    adbConnected: "ADB 连接完成!",
    connectedDevices: "已连接的设备:",
    timeout: "超时。模拟器启动可能需要更长时间。",
    manualCheck: (cmd: string) => `请手动检查: ${cmd} devices`,

    settingUpReverse: (count: number, ports: string) =>
      `正在设置 ADB reverse (${count} 台设备, 端口: ${ports})`,
    reverseApplied: (serial: string, port: number) =>
      `已设置 adb reverse: ${serial} tcp:${port} → tcp:${port}`,
    reverseFailed: (serial: string, port: number, err: unknown) =>
      `设置 adb reverse 失败: ${serial} tcp:${port} - ${err}`,
    invalidReversePorts: (value: string) =>
      `未指定有效端口: ${value}`,

    header: "Android 模拟器启动脚本 (WSL → Windows)",
    setupComplete: "设置完成!",
    runReactNative: "要启动 React Native 应用:",
    unexpectedError: (err: unknown) => `意外错误: ${err}`,
  },
  en: {
    sdkDetected: (path: string) => `Android SDK detected: ${path}`,
    windowsPath: (path: string) => `Windows SDK path: ${path}`,
    adbPath: (path: string) => `ADB path: ${path}`,
    emulatorPath: (path: string) => `Emulator path: ${path}`,
    sdkNotFound: "Android SDK not found",
    setAndroidHome:
      "Please set the ANDROID_HOME or ANDROID_SDK_ROOT environment variable",
    exampleEnv: "e.g., export ANDROID_HOME=/mnt/c/Android/Sdk",
    emulatorNotFound: (path: string) => `emulator.exe not found: ${path}`,
    adbNotFound: (path: string) => `adb.exe not found: ${path}`,

    // Environment variables
    androidHomeAutoSet: (path: string) =>
      `Automatically set ANDROID_HOME: ${path}`,
    androidHomeWarnNotSet:
      "ANDROID_HOME is not set. Tools like Expo/React Native may report errors",
    exportAndroidHomeHint: (path: string) =>
      `To persist, add to ~/.bashrc: export ANDROID_HOME=${path}`,
    exportEnvCommand: (path: string) => `export ANDROID_HOME=${path}`,

    // Proxy
    proxyDirCreated: (dir: string) => `Created proxy directory: ${dir}`,
    proxyDirCreateFailed: (dir: string, err: unknown) =>
      `Failed to create directory: ${dir} - ${err}`,
    proxyInstalled: (name: string, path: string) =>
      `Installed ${name} proxy: ${path}`,
    proxyAlreadyExists: (path: string) =>
      `Already exists: ${path}`,
    proxyInstallFailed: (err: unknown) =>
      `Failed to install proxy: ${err}`,
    proxyNotInPath: (dir: string) =>
      `${dir} is not in PATH`,
    addToBashrc: (dir: string) =>
      `Please add the following to ~/.bashrc:`,

    searchingAvds: "Searching for available emulators...",
    avdListFailed: (err: unknown) => `Failed to get AVD list: ${err}`,
    noAvds: "No available emulators found",
    createAvdInManager:
      "Please create an emulator using AVD Manager on Windows",
    availableAvds: "Available emulators:",
    avdNotFound: (name: string) => `Specified AVD not found: ${name}`,
    available: (list: string) => `Available: ${list}`,
    autoSelected: "Only one emulator available, auto-selected",
    selectAvd: "Select an emulator to launch",
    selectionCancelled: "Selection cancelled",
    selectedAvd: (name: string) => `Selected emulator: ${name}`,

    startingEmulator: (name: string) => `Starting emulator: ${name}`,
    startingBackground: "Launching in background...",
    emulatorStarted: "Emulator launch command executed",

    waitingAdb: "Waiting for ADB connection...",
    adbConnected: "ADB connection established!",
    connectedDevices: "Connected devices:",
    timeout: "Timeout. The emulator may be taking longer to start.",
    manualCheck: (cmd: string) => `Please check manually: ${cmd} devices`,

    settingUpReverse: (count: number, ports: string) =>
      `Setting up adb reverse (${count} device(s), ports: ${ports})`,
    reverseApplied: (serial: string, port: number) =>
      `adb reverse configured: ${serial} tcp:${port} → tcp:${port}`,
    reverseFailed: (serial: string, port: number, err: unknown) =>
      `Failed to configure adb reverse: ${serial} tcp:${port} - ${err}`,
    invalidReversePorts: (value: string) =>
      `No valid ports specified: ${value}`,

    header: "Android Emulator Launcher (WSL → Windows)",
    setupComplete: "Setup complete!",
    runReactNative: "To run your React Native app:",
    unexpectedError: (err: unknown) => `Unexpected error: ${err}`,
  },
};

export const t = messages[currentLang];
