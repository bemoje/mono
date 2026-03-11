# @bemoje/fs

File system utilities for reading, updating, and managing files and directories.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**deleteOlderThan**](./src/deleteOlderThan.ts): Delete files older than a given timestamp
- [**getFileAge**](./src/getFileAge.ts): Retrieves the age of a file in milliseconds.
- [**getFirstFileInDir**](./src/getFirstFileInDir.ts): Get the name of the first file (not directory) found in a directory.
- [**readFileFirstLine**](./src/readFileFirstLine.ts): Reads the first line of a file asynchronously.
- [**removeDataUrlSchemePrefix**](./src/removeDataUrlSchemePrefix.ts): Removes the data URL scheme prefix from a given string.
- [**updateFile**](./src/updateFile.ts): Updates a file by reading its content, applying a transformation function, and writing back the result. Creates the file and directories if they don't exist.
- [**updateFileLines**](./src/updateFileLines.ts): Updates a file by applying a transformation function to an array of lines. The transformation can return either a string (the entire new content) or an array of lines. Creates the file and directories if they don't exist.
- [**updateFileLinesSync**](./src/updateFileLinesSync.ts): Synchronous version of `updateFileLines`.
- [**updateFileSync**](./src/updateFileSync.ts): Synchronous version of `updateFile`.
- [**updateJsonFile**](./src/updateJsonFile.ts): Updates a JSON file by applying a transformation function to the parsed content. If the file doesn't exist or can't be parsed, uses the default value. Creates the file and directories if they don't exist.
- [**updateJsonFileSync**](./src/updateJsonFileSync.ts): Synchronous version of `updateJsonFile`.
- [**walkDirectory**](./src/walkDirectory.ts): Walk a directory recursively and return an array of paths.

<!-- EXPORTS_END -->

## Installation

```bash
npm install @bemoje/fs
```

## Usage

### Walk a Directory

Recursively traverse a directory tree:

```ts
import { walkDirectory } from '@bemoje/fs'

// Get all file paths
const files = walkDirectory('./src', { only: 'files' })

// Get paths with stats
const entries = walkDirectory('./src', { stats: true })
entries.forEach(([path, stats]) => {
  console.log(path, stats.size)
})

// Filter directories and limit depth
const shallow = walkDirectory('./src', { maxDepth: 2, filter: (dirpath, basename) => basename !== 'node_modules' })
```

### Update Files

Read, transform, and write files in one operation:

```ts
import { updateFile, updateFileSync } from '@bemoje/fs'

// Async
await updateFile('config.json', (content) => {
  return content.replace(/localhost/g, 'production.host')
})

// Sync
updateFileSync('config.json', (content) => {
  return content.replace(/localhost/g, 'production.host')
})
```

### Update File Lines

Transform files line-by-line:

```ts
import { updateFileLines, updateFileLinesSync } from '@bemoje/fs'

await updateFileLines('data.csv', (lines) => {
  return lines.filter((line) => line.trim() !== '')
})

updateFileLinesSync('data.csv', (lines) => {
  return lines.map((line) => line.toUpperCase())
})
```

### Update JSON Files

Read, transform, and write JSON files:

```ts
import { updateJsonFile, updateJsonFileSync } from '@bemoje/fs'

await updateJsonFile('package.json', (pkg) => {
  pkg.version = '2.0.0'
  return pkg
})

updateJsonFileSync('tsconfig.json', (config) => {
  config.compilerOptions.strict = true
  return config
})
```

### File Utilities

```ts
import { getFileAge, deleteOlderThan, readFileFirstLine, getFirstFileInDir } from '@bemoje/fs'

// Get file age in milliseconds
const age = await getFileAge('./data.json')

// Delete files older than 24 hours
await deleteOlderThan('./cache', 24 * 60 * 60 * 1000)

// Read only the first line of a file
const header = await readFileFirstLine('./data.csv')

// Get the first file in a directory
const firstFile = await getFirstFileInDir('./uploads')
```

### Data URL

```ts
import { removeDataUrlSchemePrefix } from '@bemoje/fs'

removeDataUrlSchemePrefix('data:image/png;base64,iVBOR...')
// 'iVBOR...'
```
