# @bemoje/path

Cross-platform path utilities extending upath with validation, manipulation, and inspection helpers.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**cwd**](./src/lib/cwd.ts): Join paths starting from process.cwd()
- [**dirnameDeep**](./src/lib/dirnameDeep.ts): Returns the absolute path of the parent directory of the given path.
- [**hasBasename**](./src/lib/hasBasename.ts): Checks if a file path has any of the specified basenames.
- [**hasExtname**](./src/lib/hasExtname.ts): Checks if a file path has any of the specified file extensions.
- [**hasParentDirname**](./src/lib/hasParentDirname.ts): Whether fspath is a subpath of a parent directory with the given name.
- [**isDotFile**](./src/lib/isDotFile.ts): Determines if a given filepath is a dotfile.
- [**isExtValid**](./src/lib/isExtValid.ts): Check if a file extension is valid. Invalid: - empty string - single dot: "." - illegal characters: <>"|?\*:
- [**isRelative**](./src/lib/isRelative.ts): Whether a path is a relative string, ie. not absolute.
- [**isUnc**](./src/lib/isUnc.ts): Determines if a given filepath is a UNC path.
- [**isValidWin32**](./src/lib/isValidWin32.ts): Check whether a provided windows filesystem path string is valid according to: https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx
- [**prefixFilename**](./src/lib/prefixFilename.ts): Append string to the beginning of the filename.
- [**root**](./src/lib/root.ts): Returns the root directory of a given path.
- [**suffixFilename**](./src/lib/suffixFilename.ts): Append string to the end of the filename.
- [**toCwdRelative**](./src/lib/toCwdRelative.ts): Solve the relative path from the process.cwd() path to the {p} path. At times we have two absolute paths, and we need to derive the relative path from one to the other. This is actually the reverse transform of path.resolve.
- [**toWin32**](./src/lib/toWin32.ts): Ensures win32 backslashes are used instead of forward slashes.

<!-- EXPORTS_END -->

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
