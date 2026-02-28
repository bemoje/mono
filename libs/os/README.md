# @bemoje/os

Operating system detection and platform-specific utilities.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

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

## API Reference

| Export                        | Description                                              |
| ----------------------------- | -------------------------------------------------------- |
| `getOS`                       | Detect current OS ('windows', 'osx', 'linux', 'unknown') |
| `isWindows`                   | Check if running on Windows                              |
| `isLinux`                     | Check if running on Linux                                |
| `isOSX`                       | Check if running on macOS                                |
| `getAppDataPath`              | Get OS-appropriate app data directory                    |
| `getHomeDirectory`            | Get user home directory                                  |
| `getTempDataPath`             | Get temp directory path                                  |
| `getTempFilepath`             | Get a unique temp file path                              |
| `isVsCodeInstalled`           | Check if VS Code CLI is available                        |
| `openInDefaultBrowserCommand` | Get command to open URL in default browser               |
| `defaultOpenInEditorCommand`  | Get command to open file in text editor                  |
| `getDefaultBrowserWindows`    | Get default browser info on Windows                      |
| `winExplorerOpenDirectory`    | Open directory in Windows Explorer                       |
| `isLinuxProgramInstalled`     | Check if a program is installed on Linux                 |
