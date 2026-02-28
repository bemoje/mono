# @bemoje/node

Node.js utilities for process execution, logging, timing, streams, and system monitoring.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/node
```

## Usage

### Execute Shell Commands

```ts
import { execute } from '@bemoje/node'

// Execute a single command with colored echo
execute('git status')

// Execute silently and capture output
const output = execute('git branch', { silent: true })

// Execute multiple commands
execute(['npm run build', 'npm test'])

// Execute in a specific directory
execute('ls -la', { cwd: '/some/path' })
```

### Create Logger

Colored, prefixed terminal logging:

```ts
import { createLogger } from '@bemoje/node'

const log = createLogger('MyApp')

log.start('Initializing...') // [MyApp] [START] Initializing...
log.info('Processing data') // [MyApp] [INFO]  Processing data
log.done('Complete!') // [MyApp] [DONE]  Complete!
log.warn('Disk space low') // [MyApp] [WARN]  Disk space low
log.error(new Error('fail')) // [MyApp] [ERROR] Error: fail
log.debug('Debug info') // [MyApp] [DEBUG] Debug info
```

### Timer

Measure and log task execution time:

```ts
import { timer } from '@bemoje/node'

// Sync
timer('build', (log) => {
  // ... do work
  log.info('Step 1 done')
})
// [build] [START]
// [build] [INFO]  Step 1 done
// [build] [DONE]  1.23 seconds

// Async
await timer('deploy', async (log) => {
  await deployToServer()
})
```

### Streams

```ts
import { streamToString, StringStream } from '@bemoje/node'

// Convert a Readable stream to string
const content = await streamToString(fs.createReadStream('file.txt'))

// Create a Readable from a string
const stream = new StringStream('hello world')
```

### Prompt User Input

```ts
import { prompt } from '@bemoje/node'

const name = await prompt('What is your name? ')

// With validation callback
const age = await prompt('Age: ', (input) => {
  const n = parseInt(input)
  return isNaN(n) ? '' : input // return empty to re-prompt
})
```

### Memory Usage

```ts
import { memoryUsage, getCurrentMemoryUsage } from '@bemoje/node'

const mem = memoryUsage(2) // rounded to 2 decimals
console.log(mem.heapUsed) // e.g. 45.23 (MB)

const heapMB = getCurrentMemoryUsage() // current heap in MB
```

### Spawn Processes

```ts
import { spawnChildProcess, spawnNodeProcess } from '@bemoje/node'

await spawnChildProcess('/usr/bin/python3', ['script.py'])
await spawnNodeProcess(['--version'])
```

## API Reference

| Export                     | Description                                                 |
| -------------------------- | ----------------------------------------------------------- |
| `execute`                  | Execute shell commands with logging and output control      |
| `execOutput`               | Execute a command and return stdout/stderr without throwing |
| `createLogger`             | Create a colored, prefixed terminal logger                  |
| `timer`                    | Measure and log task execution time                         |
| `prompt`                   | Prompt user for terminal input with optional validation     |
| `streamToString`           | Convert a Readable stream to a string                       |
| `StringStream`             | Create a Readable stream from a string                      |
| `memoryUsage`              | Get memory usage in megabytes                               |
| `getCurrentMemoryUsage`    | Get current heap usage in MB                                |
| `spawnChildProcess`        | Spawn a child process with promise interface                |
| `spawnNodeProcess`         | Spawn a Node.js child process                               |
| `startPowerShellScript`    | Execute a PowerShell script                                 |
| `shellSpawnProgram`        | Spawn a program with promise interface                      |
| `formatTableForTerminal`   | Format a 2D array as a terminal table                       |
| `toError`                  | Convert any value to an Error object                        |
| `argvHasHelpFlag`          | Check if argv contains --help or -h                         |
| `isTerminalColorSupported` | Check if terminal supports colors                           |
