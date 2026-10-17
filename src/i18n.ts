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

    header: "Android Emulator Launcher (WSL → Windows)",
    setupComplete: "Setup complete!",
    runReactNative: "To run your React Native app:",
    unexpectedError: (err: unknown) => `Unexpected error: ${err}`,
  },
};

export const t = messages[currentLang];
