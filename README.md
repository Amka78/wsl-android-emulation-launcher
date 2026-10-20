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

インストール後は短縮コマンド `wsl-avd` で起動できます（長い名前もそのまま使えます）。

### 使い方

```bash
# インタラクティブにAVDを選択して起動
wsl-avd

# AVD名を直接指定
wsl-avd --avd Pixel_4_API_28

# AVD一覧を表示
wsl-avd --list

# ADB接続待機をスキップ
wsl-avd --no-wait

# ローカルビルドしたAPKをエミュレーターにインストール
wsl-avd --install ./app-release.apk

# adb reverse を複数ポートに設定（デフォルトは 8081）
wsl-avd --reverse 8081,3000
```

### 前提条件

- WSL環境
- Windows側にAndroid SDKがインストールされていること
- `ANDROID_HOME` 環境変数が設定されていること（`.env` または shell設定）

### Windows側の事前設定

このツールを使う前に、Windows側で以下の設定が必要です。

#### 1. Android Studio / Android SDK のインストール

[Android Studio](https://developer.android.com/studio) をダウンロード・インストールし、SDK Manager から以下をインストールしてください：

- **Android SDK** (SDK Platform)
- **Android SDK Platform-Tools** (adb)
- **Android Emulator**

SDK Manager は Android Studio の `Settings > Languages & Frameworks > Android SDK` から開けます。

#### 2. ANDROID_HOME 環境変数の設定

Windows のシステム環境変数として `ANDROID_HOME` を設定してください。

**設定例（SDK を `C:\Android\Sdk` にインストールした場合）:**

```
変数名: ANDROID_HOME
値: C:\Android\Sdk
```

**設定方法:**
1. スタートメニュー > 「環境変数」で検索 > 「システム環境変数の編集」
2. 「環境変数」ボタンをクリック
3. 「システム変数」または「ユーザー変数」で「新規」をクリック
4. `ANDROID_HOME` を追加

設定後、コマンドプロンプトで確認できます：

```cmd
echo %ANDROID_HOME%
```

#### 3. AVD（Android Virtual Device）の作成

Android Studio の Device Manager、またはコマンドラインで AVD を作成します。

**Android Studio で作成:**
1. `Tools > Device Manager` を開く
2. 「Create Device」をクリック
3. デバイス定義とシステムイメージを選択して作成

**コマンドラインで作成:**

```cmd
# SDK Manager で利用可能なシステムイメージを確認
%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager --list

# システムイメージをインストール（例: API 28）
%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager "system-images;android-28;google_apis;x86_64"

# AVD を作成
%ANDROID_HOME%\cmdline-tools\latest\bin\avdmanager create avd -n Pixel_4_API_28 -k "system-images;android-28;google_apis;x86_64" -d "pixel_4"

# 作成された AVD を確認
%ANDROID_HOME%\emulator\emulator.exe -list-avds
```

#### 4. 仮想化テクノロジーの有効化

Android Emulator はハードウェア仮想化が必要です。

**Intel CPU の場合:**
- BIOS/UEFI で Intel VT-x を有効化
- [Intel HAXM](https://github.com/intel/haxm) をインストール（Android Studio の SDK Manager からインストール可能）

**AMD CPU の場合:**
- BIOS/UEFI で AMD-V を有効化
- Windows 10 以降では Hyper-V が自動的に使用されます

**Windows 11 / Hyper-V:**
Windows の機能として「Hyper-V」を有効化してください：
1. 「コントロールパネル > プログラム > Windows の機能を有効化または無効化」
2. 「Hyper-V」にチェック

#### 5. WSL から Windows 実行ファイルへのアクセス

WSL からは `/mnt/c/` 経由で Windows のファイルにアクセスできます。追加設定は通常不要ですが、`ANDROID_HOME` が正しく設定されているか確認してください。

**確認コマンド（WSL側）:**

```bash
# SDK が存在するか確認
ls -la /mnt/c/Android/Sdk/emulator/emulator.exe
ls -la /mnt/c/Android/Sdk/platform-tools/adb.exe
```

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
| `--reverse <ports>` | 起動後に `adb reverse` を設定するポート（カンマ区切り、デフォルト: `8081`） |
| `--skip-reverse` | `adb reverse` の自動設定をスキップ |
| `--list` | AVD一覧を表示して終了 |
| `--export-env` | `ANDROID_HOME` exportコマンドを出力（`eval`用） |
| `--install-proxy` | `adb`/`emulator`プロキシを`~/.local/bin`にインストール |
| `--install <apk>` | ローカルビルドしたAPKをエミュレーターにインストール（未接続なら起動） |
| `-V, --version` | バージョンを表示 |
| `-h, --help` | ヘルプを表示 |

### ローカルビルドしたAPKのインストール（--install）

エミュレーター（または接続済みデバイス）に、ローカルでビルドしたAPKをインストールします。

```bash
# デバイス未接続の場合はエミュレーターを起動してからインストール
wsl-avd --install ./app-release.apk

# 起動するAVDを指定してインストール
wsl-avd --avd Pixel_4_API_28 --install ./app-release.apk
```

- 未接続時はAVD選択 → エミュレーター起動 → ADB接続待機を経てインストールします
- インストールは `adb install -r -d` 相当（既存アプリの置き換え・ダウングレード許可）
- `--skip-reverse` を付けるとインストール前の `adb reverse` 設定をスキップできます

### Expo/React NativeでANDROID_HOMEエラーを回避

WSL側で`ANDROID_HOME`が未設定の場合、Expo等が`Failed to resolve the Android SDK path`エラーを出します。

**方法1: 一時的に設定**
```bash
eval $(wsl-avd --export-env)
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
wsl-avd --install-proxy

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

安装后可使用简写命令 `wsl-avd` 启动（长名称仍可继续使用）。

### 使用方法

```bash
# 交互式选择 AVD 并启动
wsl-avd

# 直接指定 AVD 名称
wsl-avd --avd Pixel_4_API_28

# 显示 AVD 列表
wsl-avd --list

# 跳过 ADB 连接等待
wsl-avd --no-wait

# 安装本地构建的 APK 到模拟器
wsl-avd --install ./app-release.apk

# 为多个端口设置 adb reverse（默认为 8081）
wsl-avd --reverse 8081,3000
```

### 前提条件

- WSL 环境
- Windows 端已安装 Android SDK
- 已设置 `ANDROID_HOME` 环境变量（`.env` 或 shell 配置）

### Windows 端预先设置

使用本工具前，需要在 Windows 端完成以下设置。

#### 1. 安装 Android Studio / Android SDK

下载并安装 [Android Studio](https://developer.android.com/studio)，通过 SDK Manager 安装以下内容：

- **Android SDK** (SDK Platform)
- **Android SDK Platform-Tools** (adb)
- **Android Emulator**

SDK Manager 可从 Android Studio 的 `Settings > Languages & Frameworks > Android SDK` 打开。

#### 2. 设置 ANDROID_HOME 环境变量

在 Windows 系统环境变量中设置 `ANDROID_HOME`。

**设置示例（SDK 安装在 `C:\Android\Sdk` 的情况）:**

```
变量名: ANDROID_HOME
值: C:\Android\Sdk
```

**设置方法:**
1. 开始菜单 > 搜索「环境变量」> 「编辑系统环境变量」
2. 点击「环境变量」按钮
3. 在「系统变量」或「用户变量」中点击「新建」
4. 添加 `ANDROID_HOME`

设置后可在命令提示符中确认：

```cmd
echo %ANDROID_HOME%
```

#### 3. 创建 AVD（Android Virtual Device）

通过 Android Studio 的 Device Manager 或命令行创建 AVD。

**通过 Android Studio 创建:**
1. 打开 `Tools > Device Manager`
2. 点击「Create Device」
3. 选择设备定义和系统镜像创建

**通过命令行创建:**

```cmd
# 查看可用的系统镜像
%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager --list

# 安装系统镜像（例: API 28）
%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager "system-images;android-28;google_apis;x86_64"

# 创建 AVD
%ANDROID_HOME%\cmdline-tools\latest\bin\avdmanager create avd -n Pixel_4_API_28 -k "system-images;android-28;google_apis;x86_64" -d "pixel_4"

# 确认已创建的 AVD
%ANDROID_HOME%\emulator\emulator.exe -list-avds
```

#### 4. 启用虚拟化技术

Android Emulator 需要硬件虚拟化支持。

**Intel CPU:**
- 在 BIOS/UEFI 中启用 Intel VT-x
- 安装 [Intel HAXM](https://github.com/intel/haxm)（可从 Android Studio 的 SDK Manager 安装）

**AMD CPU:**
- 在 BIOS/UEFI 中启用 AMD-V
- Windows 10 及以上版本会自动使用 Hyper-V

**Windows 11 / Hyper-V:**
在 Windows 功能中启用「Hyper-V」：
1. 「控制面板 > 程序 > 启用或关闭 Windows 功能」
2. 勾选「Hyper-V」

#### 5. 从 WSL 访问 Windows 可执行文件

WSL 可通过 `/mnt/c/` 访问 Windows 文件。通常无需额外设置，但请确认 `ANDROID_HOME` 已正确设置。

**确认命令（WSL 端）:**

```bash
# 确认 SDK 是否存在
ls -la /mnt/c/Android/Sdk/emulator/emulator.exe
ls -la /mnt/c/Android/Sdk/platform-tools/adb.exe
```

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
| `--reverse <ports>` | 启动后设置 `adb reverse` 的端口（逗号分隔，默认: `8081`） |
| `--skip-reverse` | 跳过 `adb reverse` 自动设置 |
| `--list` | 显示 AVD 列表并退出 |
| `--export-env` | 输出 `ANDROID_HOME` export 命令（用于 `eval`） |
| `--install-proxy` | 将 `adb`/`emulator` 代理安装到 `~/.local/bin` |
| `--install <apk>` | 安装本地构建的 APK 到模拟器（未连接时自动启动） |
| `-V, --version` | 显示版本号 |
| `-h, --help` | 显示帮助信息 |

### 安装本地构建的 APK（--install）

将本地构建的 APK 安装到模拟器（或已连接的设备）。

```bash
# 设备未连接时先启动模拟器再安装
wsl-avd --install ./app-release.apk

# 指定要启动的 AVD 后安装
wsl-avd --avd Pixel_4_API_28 --install ./app-release.apk
```

- 未连接时依次执行 AVD 选择 → 启动模拟器 → 等待 ADB 连接 → 安装
- 安装相当于 `adb install -r -d`（替换现有应用并允许降级）
- 添加 `--skip-reverse` 可跳过安装前的 `adb reverse` 设置

### 解决 Expo/React Native 的 ANDROID_HOME 错误

如果 WSL 端未设置 `ANDROID_HOME`，Expo 等工具会报 `Failed to resolve the Android SDK path` 错误。

**方法1：临时设置**
```bash
eval $(wsl-avd --export-env)
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
wsl-avd --install-proxy

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

After installation, use the short command `wsl-avd` (the long name still works).

### Usage

```bash
# Interactively select AVD and launch
wsl-avd

# Specify AVD name directly
wsl-avd --avd Pixel_4_API_28

# List available AVDs
wsl-avd --list

# Skip ADB connection wait
wsl-avd --no-wait

# Install a locally built APK to the emulator
wsl-avd --install ./app-release.apk

# Configure adb reverse for multiple ports (default: 8081)
wsl-avd --reverse 8081,3000
```

### Prerequisites

- WSL environment
- Android SDK installed on Windows side
- `ANDROID_HOME` environment variable configured (`.env` or shell config)

### Windows-Side Setup

Before using this tool, you need to complete the following setup on Windows.

#### 1. Install Android Studio / Android SDK

Download and install [Android Studio](https://developer.android.com/studio), then install the following via SDK Manager:

- **Android SDK** (SDK Platform)
- **Android SDK Platform-Tools** (adb)
- **Android Emulator**

SDK Manager can be opened from Android Studio via `Settings > Languages & Frameworks > Android SDK`.

#### 2. Set ANDROID_HOME Environment Variable

Set `ANDROID_HOME` as a Windows system environment variable.

**Example (when SDK is installed at `C:\Android\Sdk`):**

```
Variable name: ANDROID_HOME
Value: C:\Android\Sdk
```

**How to set:**
1. Start Menu > Search for "Environment Variables" > "Edit the system environment variables"
2. Click "Environment Variables" button
3. Under "System variables" or "User variables", click "New"
4. Add `ANDROID_HOME`

After setting, you can verify in Command Prompt:

```cmd
echo %ANDROID_HOME%
```

#### 3. Create an AVD (Android Virtual Device)

Create an AVD via Android Studio's Device Manager or command line.

**Create via Android Studio:**
1. Open `Tools > Device Manager`
2. Click "Create Device"
3. Select device definition and system image to create

**Create via Command Line:**

```cmd
# List available system images
%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager --list

# Install a system image (e.g., API 28)
%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager "system-images;android-28;google_apis;x86_64"

# Create an AVD
%ANDROID_HOME%\cmdline-tools\latest\bin\avdmanager create avd -n Pixel_4_API_28 -k "system-images;android-28;google_apis;x86_64" -d "pixel_4"

# Verify created AVDs
%ANDROID_HOME%\emulator\emulator.exe -list-avds
```

#### 4. Enable Virtualization Technology

Android Emulator requires hardware virtualization support.

**Intel CPU:**
- Enable Intel VT-x in BIOS/UEFI
- Install [Intel HAXM](https://github.com/intel/haxm) (available via Android Studio's SDK Manager)

**AMD CPU:**
- Enable AMD-V in BIOS/UEFI
- Hyper-V is automatically used on Windows 10 and later

**Windows 11 / Hyper-V:**
Enable "Hyper-V" in Windows Features:
1. "Control Panel > Programs > Turn Windows features on or off"
2. Check "Hyper-V"

#### 5. Accessing Windows Executables from WSL

WSL can access Windows files via `/mnt/c/`. No additional setup is usually required, but make sure `ANDROID_HOME` is properly configured.

**Verification commands (on WSL side):**

```bash
# Check if SDK exists
ls -la /mnt/c/Android/Sdk/emulator/emulator.exe
ls -la /mnt/c/Android/Sdk/platform-tools/adb.exe
```

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
| `--reverse <ports>` | Ports to configure with `adb reverse` after launch (comma-separated, default: `8081`) |
| `--skip-reverse` | Skip automatic `adb reverse` setup |
| `--list` | List available AVDs and exit |
| `--export-env` | Print `ANDROID_HOME` export command (for `eval`) |
| `--install-proxy` | Install `adb`/`emulator` proxy scripts to `~/.local/bin` |
| `--install <apk>` | Install a locally built APK to the emulator (launches emulator if none connected) |
| `-V, --version` | Show version number |
| `-h, --help` | Show help |

### Installing a Locally Built APK (--install)

Installs a locally built APK to the emulator (or any connected device).

```bash
# Launches the emulator first if no device is connected
wsl-avd --install ./app-release.apk

# Specify the AVD to launch when installing
wsl-avd --avd Pixel_4_API_28 --install ./app-release.apk
```

- If no device is connected: AVD selection → emulator launch → ADB wait → install
- Equivalent to `adb install -r -d` (replaces the existing app, allows downgrades)
- Add `--skip-reverse` to skip the `adb reverse` setup before installing

### Fixing ANDROID_HOME Errors in Expo/React Native

If `ANDROID_HOME` is not set in WSL, tools like Expo will report `Failed to resolve the Android SDK path` error.

**Method 1: Temporary setup**
```bash
eval $(wsl-avd --export-env)
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
wsl-avd --install-proxy

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
