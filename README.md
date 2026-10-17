# wsl-android-emulation-launcher

WSL側からWindowsのAndroid Emulatorを起動し、ADB接続するCLIツール。  
从 WSL 启动 Windows Android 模拟器并连接 ADB 的 CLI 工具。  
CLI tool to launch Android emulators from WSL with ADB connection support.

---

## 日本語

### インストール

```bash
npm install -g wsl-android-emulation-launcher
```

または npx で直接実行:

```bash
npx wsl-android-emulation-launcher
```

### 使い方

```bash
# インタラクティブにAVDを選択して起動
wsl-android-emulation-launcher

# AVD名を直接指定
wsl-android-emulation-launcher --avd Pixel_4_API_28

# AVD一覧を表示
wsl-android-emulation-launcher --list

# ADB接続待機をスキップ
wsl-android-emulation-launcher --no-wait
```

### 前提条件

- WSL環境
- Windows側にAndroid SDKがインストールされていること
- `ANDROID_HOME` 環境変数が設定されていること（`.env` または shell設定）

### SDKパスの自動検出

以下の順序でAndroid SDKを検出します:

1. `ANDROID_HOME` 環境変数
2. `ANDROID_SDK_ROOT` 環境変数
3. `/mnt/c/Users/<username>/AppData/Local/Android/Sdk`
4. `/mnt/c/Android/Sdk`
5. `/mnt/c/Program Files/Android/Sdk`

### オプション

| オプション | 説明 |
|---|---|
| `--avd <name>` | 起動するAVD名を指定（インタラクティブ選択をスキップ） |
| `--no-wait` | ADB接続待機をスキップ |
| `--list` | AVD一覧を表示して終了 |
| `--export-env` | `ANDROID_HOME` exportコマンドを出力（`eval`用） |
| `--install-proxy` | `adb`/`emulator`プロキシを`~/.local/bin`にインストール |
| `-V, --version` | バージョンを表示 |
| `-h, --help` | ヘルプを表示 |

### Expo/React NativeでANDROID_HOMEエラーを回避

WSL側で`ANDROID_HOME`が未設定の場合、Expo等が`Failed to resolve the Android SDK path`エラーを出します。

**方法1: 一時的に設定**
```bash
eval $(wsl-android-emulation-launcher --export-env)
npx expo run:android
```

**方法2: 恒久的に設定**
```bash
echo 'export ANDROID_HOME=/mnt/c/Android/Sdk' >> ~/.bashrc
source ~/.bashrc
```

### adb/emulatorプロキシのインストール

Expo等が`adb`コマンドを呼び出す際、WSL側にはWindows版`adb.exe`しか存在しないため`ENOENT`エラーになります。プロキシをインストールすると、WSL側の`adb`コマンドがWindows版`adb.exe`を呼び出すようになります。

```bash
# プロキシをインストール（初回のみ）
wsl-android-emulation-launcher --install-proxy

# PATHに追加
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# テスト
adb version
```

### ADB接続のトラブルシューティング

Windows 11 を使用している場合は、`.wslconfig` で mirrored networking を有効にすると ADB 接続が安定します：

```ini
# ~/.wslconfig
[wsl2]
networkingMode=mirrored
```

---

## 中文

### 安装

```bash
npm install -g wsl-android-emulation-launcher
```

或直接使用 npx 运行:

```bash
npx wsl-android-emulation-launcher
```

### 使用方法

```bash
# 交互式选择 AVD 并启动
wsl-android-emulation-launcher

# 直接指定 AVD 名称
wsl-android-emulation-launcher --avd Pixel_4_API_28

# 显示 AVD 列表
wsl-android-emulation-launcher --list

# 跳过 ADB 连接等待
wsl-android-emulation-launcher --no-wait
```

### 前提条件

- WSL 环境
- Windows 端已安装 Android SDK
- 已设置 `ANDROID_HOME` 环境变量（`.env` 或 shell 配置）

### SDK 路径自动检测

按以下顺序检测 Android SDK:

1. `ANDROID_HOME` 环境变量
2. `ANDROID_SDK_ROOT` 环境变量
3. `/mnt/c/Users/<username>/AppData/Local/Android/Sdk`
4. `/mnt/c/Android/Sdk`
5. `/mnt/c/Program Files/Android/Sdk`

### 选项

| 选项 | 说明 |
|---|---|
| `--avd <name>` | 指定要启动的 AVD 名称（跳过交互选择） |
| `--no-wait` | 跳过 ADB 连接等待 |
| `--list` | 显示 AVD 列表并退出 |
| `--export-env` | 输出 `ANDROID_HOME` export 命令（用于 `eval`） |
| `--install-proxy` | 将 `adb`/`emulator` 代理安装到 `~/.local/bin` |
| `-V, --version` | 显示版本号 |
| `-h, --help` | 显示帮助信息 |

### 解决 Expo/React Native 的 ANDROID_HOME 错误

如果 WSL 端未设置 `ANDROID_HOME`，Expo 等工具会报 `Failed to resolve the Android SDK path` 错误。

**方法1：临时设置**
```bash
eval $(wsl-android-emulation-launcher --export-env)
npx expo run:android
```

**方法2：永久设置**
```bash
echo 'export ANDROID_HOME=/mnt/c/Android/Sdk' >> ~/.bashrc
source ~/.bashrc
```

### 安装 adb/emulator 代理

当 Expo 等工具调用 `adb` 命令时，WSL 端只有 Windows 版的 `adb.exe`，会出现 `ENOENT` 错误。安装代理后，WSL 端的 `adb` 命令会调用 Windows 版的 `adb.exe`。

```bash
# 安装代理（仅首次）
wsl-android-emulation-launcher --install-proxy

# 添加到 PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 测试
adb version
```

### ADB 连接故障排除

如果使用 Windows 11,在 `.wslconfig` 中启用 mirrored networking 可以使 ADB 连接更稳定:

```ini
# ~/.wslconfig
[wsl2]
networkingMode=mirrored
```

---

## English

### Installation

```bash
npm install -g wsl-android-emulation-launcher
```

Or run directly with npx:

```bash
npx wsl-android-emulation-launcher
```

### Usage

```bash
# Interactively select AVD and launch
wsl-android-emulation-launcher

# Specify AVD name directly
wsl-android-emulation-launcher --avd Pixel_4_API_28

# List available AVDs
wsl-android-emulation-launcher --list

# Skip ADB connection wait
wsl-android-emulation-launcher --no-wait
```

### Prerequisites

- WSL environment
- Android SDK installed on Windows side
- `ANDROID_HOME` environment variable configured (`.env` or shell config)

### SDK Path Auto-Detection

Detects Android SDK in the following order:

1. `ANDROID_HOME` environment variable
2. `ANDROID_SDK_ROOT` environment variable
3. `/mnt/c/Users/<username>/AppData/Local/Android/Sdk`
4. `/mnt/c/Android/Sdk`
5. `/mnt/c/Program Files/Android/Sdk`

### Options

| Option | Description |
|---|---|
| `--avd <name>` | Specify AVD name to launch (skip interactive selection) |
| `--no-wait` | Skip ADB connection wait |
| `--list` | List available AVDs and exit |
| `--export-env` | Print `ANDROID_HOME` export command (for `eval`) |
| `--install-proxy` | Install `adb`/`emulator` proxy scripts to `~/.local/bin` |
| `-V, --version` | Show version number |
| `-h, --help` | Show help |

### Fixing ANDROID_HOME Errors in Expo/React Native

If `ANDROID_HOME` is not set in WSL, tools like Expo will report `Failed to resolve the Android SDK path` error.

**Method 1: Temporary setup**
```bash
eval $(wsl-android-emulation-launcher --export-env)
npx expo run:android
```

**Method 2: Permanent setup**
```bash
echo 'export ANDROID_HOME=/mnt/c/Android/Sdk' >> ~/.bashrc
source ~/.bashrc
```

### Installing adb/emulator Proxies

When tools like Expo call the `adb` command, WSL only has Windows `adb.exe`, causing `ENOENT` errors. Installing proxies makes WSL's `adb` command call Windows `adb.exe`.

```bash
# Install proxies (first time only)
wsl-android-emulation-launcher --install-proxy

# Add to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Test
adb version
```

### ADB Connection Troubleshooting

If you're using Windows 11, enable mirrored networking in `.wslconfig` for more stable ADB connections:

```ini
# ~/.wslconfig
[wsl2]
networkingMode=mirrored
```

---

## Development / 开发 / 開発

```bash
npm install
npm run build
node dist/index.js
```

## License / 许可证 / ライセンス

MIT
