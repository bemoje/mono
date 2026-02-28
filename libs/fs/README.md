# @bemoje/fs

File system utilities for reading, updating, and managing files and directories.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

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
const shallow = walkDirectory('./src', {
  maxDepth: 2,
  filter: (dirpath, basename) => basename !== 'node_modules',
})
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

## API Reference

| Export                      | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| `walkDirectory`             | Recursively walk a directory with filtering and stats |
| `updateFile`                | Async read-transform-write a file                     |
| `updateFileSync`            | Sync read-transform-write a file                      |
| `updateFileLines`           | Async read-transform-write a file by lines            |
| `updateFileLinesSync`       | Sync read-transform-write a file by lines             |
| `updateJsonFile`            | Async read-transform-write a JSON file                |
| `updateJsonFileSync`        | Sync read-transform-write a JSON file                 |
| `deleteOlderThan`           | Delete files older than a given age                   |
| `getFileAge`                | Get file age in milliseconds                          |
| `getFirstFileInDir`         | Get the first file name in a directory                |
| `readFileFirstLine`         | Read only the first line of a file                    |
| `removeDataUrlSchemePrefix` | Strip data URL scheme prefix from a string            |
