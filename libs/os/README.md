# @bemoje/os

Operating system detection and platform-specific utilities.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**defaultOpenInEditorCommand**](./src/defaultOpenInEditorCommand.ts): Get the default command to open a file in in a text editor. If VSCode is installed, this is used. Otherwise, the default text editor of the OS is used.
- [**getAppDataPath**](./src/getAppDataPath.ts): Get the app data path, depending on the current OS (win, osx, linux).
- [**getDefaultBrowserWindows**](./src/getDefaultBrowserWindows.ts): Gets the default browser identifier on Windows by querying the registry.
- [**getHomeDirectory**](./src/getHomeDirectory.ts): Returns the home directory of the current user.
- [**getOS**](./src/getOS.ts): Determines the current operating system. It uses the isWindows, isOSX, and isLinux functions to determine the current operating system.
- [**getTempDataPath**](./src/getTempDataPath.ts): Returns a path to the os tmpdir location.
- [**getTempFilepath**](./src/getTempFilepath.ts): Returns a path to a temporary file with the given basename and subpath.
- [**isLinux**](./src/isLinux.ts): Checks if the current platform is Linux. It checks the 'process' object and the 'platform' property to determine if the platform is 'linux'.
- [**isLinuxProgramInstalled**](./src/isLinuxProgramInstalled.ts): LINUX ONLY: Returns whether a program is installed on the system. Always returns false of OS is not linux.
- [**isOSX**](./src/isOSX.ts): Checks if the current platform is OSX. It checks the 'process' object and the 'platform' property to determine if the platform is 'darwin'.
- [**isVsCodeInstalled**](./src/isVsCodeInstalled.ts): Returns whether Visual Studio Code is installed on the system.
- [**isWindows**](./src/isWindows.ts): Checks if the current platform is Windows.
- [**openInDefaultBrowserCommand**](./src/openInDefaultBrowserCommand.ts): Gets the command to open a URL in the default browser for the current operating system.
- [**winExplorerOpenDirectory**](./src/winExplorerOpenDirectory.ts): Opens a directory in Windows Explorer. Works on Windows only.

<!-- EXPORTS_END -->

## Installation

```bash
npm install @bemoje/os
```

## Usage

### Platform Detection

```ts
import { getOS, isWindows, isLinux, isOSX } from '@bemoje/os'

getOS() // 'windows' | 'osx' | 'linux' | 'unknown'
isWindows() // true/false
isLinux() // true/false
isOSX() // true/false
```

### System Paths

```ts
import { getAppDataPath, getHomeDirectory, getTempDataPath, getTempFilepath } from '@bemoje/os'

getAppDataPath('MyApp') // C:\Users\user\AppData\Roaming\MyApp (Windows)
getHomeDirectory() // /home/user (Linux) or C:\Users\user
getTempDataPath('cache') // /tmp/cache
getTempFilepath('output.json') // /tmp/tmp/1234567890/output.json
```

### Browser and Editor Detection

```ts
import { isVsCodeInstalled, openInDefaultBrowserCommand, defaultOpenInEditorCommand } from '@bemoje/os'

isVsCodeInstalled() // true if `code` command exists

openInDefaultBrowserCommand('https://example.com')
// 'msedge "https://example.com"' (Windows) or 'open safari "https://example.com"' (macOS)

defaultOpenInEditorCommand()
// 'code -w' if VS Code is installed, otherwise OS default editor
```

### Windows Utilities

```ts
import { winExplorerOpenDirectory, getDefaultBrowserWindows } from '@bemoje/os'

await winExplorerOpenDirectory('C:\\Users\\user\\Desktop')

getDefaultBrowserWindows()
// { name: 'Chrome', run: 'chrome', id: 'com.google.chrome' }
```
