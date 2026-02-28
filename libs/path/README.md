# @bemoje/path

Cross-platform path utilities extending upath with validation, manipulation, and inspection helpers.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/path
```

## Usage

### Working Directory Helpers

```ts
import { cwd, toCwdRelative } from '@bemoje/path'

// Join paths from cwd
cwd('src', 'index.ts') // /home/user/project/src/index.ts

// Convert absolute to cwd-relative
toCwdRelative('/home/user/project/src/index.ts') // 'src/index.ts'
```

### Filename Manipulation

```ts
import { prefixFilename, suffixFilename } from '@bemoje/path'

prefixFilename('path/to/file.ts', 'new-') // 'path/to/new-file.ts'
suffixFilename('path/to/file.ts', '.bak') // 'path/to/file.bak.ts'
```

### Path Inspection

```ts
import { hasExtname, hasBasename, hasParentDirname, isDotFile, isRelative, isUnc } from '@bemoje/path'

hasExtname('index.ts', ['ts', 'tsx']) // true
hasExtname.ts('index.ts') // true
hasExtname.json('config.json') // true

hasBasename('src/index.ts', 'index.ts') // true
hasParentDirname('src/lib/utils.ts', 'lib') // true

isDotFile('.gitignore') // true
isRelative('./src') // true
isUnc('\\\\server\\share') // true
```

### Validation

```ts
import { isValidWin32, isExtValid } from '@bemoje/path'

isValidWin32('C:\\Users\\file.txt') // true
isValidWin32('C:\\Users\\file<>.txt') // false

isExtValid('.ts') // true
isExtValid('') // false
isExtValid('.') // false
```

### Directory and Root Helpers

```ts
import { dirnameDeep, root, toWin32 } from '@bemoje/path'

dirnameDeep('a/b/c/d', 2) // 'a/b'
root('/home/user') // '/'
toWin32('path/to/file') // 'path\\to\\file'
```

## API Reference

| Export             | Description                                    |
| ------------------ | ---------------------------------------------- |
| `cwd`              | Join paths from process.cwd()                  |
| `toCwdRelative`    | Convert absolute path to cwd-relative          |
| `prefixFilename`   | Prepend string to filename                     |
| `suffixFilename`   | Append string to filename (before extension)   |
| `dirnameDeep`      | Get parent directory N levels up               |
| `hasBasename`      | Check if path has a specific basename          |
| `hasExtname`       | Check if path has specific extension(s)        |
| `hasParentDirname` | Check if path is under a parent directory name |
| `isDotFile`        | Check if path is a dotfile                     |
| `isExtValid`       | Validate a file extension                      |
| `isRelative`       | Check if path is relative                      |
| `isUnc`            | Check if path is a UNC path                    |
| `isValidWin32`     | Validate a Windows file path                   |
| `root`             | Get root directory of a path                   |
| `toWin32`          | Convert forward slashes to backslashes         |
