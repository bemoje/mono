# @bemoje/node

Node.js utilities for process execution, logging, timing, streams, and system monitoring.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**StringStream**](./src/StringStream.ts): Extension of Node's native Readable class for converting a string into a Readable stream.
- [**argvHasHelpFlag**](./src/argvHasHelpFlag.ts): Checks if the command line arguments contain a help flag (--help or -h).
- [**createLogger**](./src/createLogger.ts): Creates a logger instance with colored output and consistent formatting.
- [**execOutput**](./src/execOutput.ts): Helper function to execute a shell command and return stdout and stderr without throwing on error. If there was an error and nothing was sent to stderr, the error.message takes its place.
- [**execute**](./src/execute.ts): Execute one or multiple shell commands.
- [**formatTableForTerminal**](./src/formatTableForTerminal.ts): Formats a 2D array of strings as a terminal table with optional headers and styling.
- [**getCurrentMemoryUsage**](./src/getCurrentMemoryUsage.ts): Get the current heap memory usage in megabytes.
- [**isTerminalColorSupported**](./src/isTerminalColorSupported.ts): Check if colored terminal output is (probably) supported.
- [**memoryUsage**](./src/memoryUsage.ts): Returns the memory usage of the Node.js process with values converted from bytes to megabytes and rounded to the specified precision.
- [**prompt**](./src/prompt.ts): Prompt the user for input.
- [**shellSpawnProgram**](./src/shellSpawnProgram.ts): Spawns a program using child_process.spawn with promise-based interface and optional stdio inheritance control.
- [**spawnChildProcess**](./src/spawnChildProcess.ts): Spawn a child process.
- [**spawnNodeProcess**](./src/spawnNodeProcess.ts): Spawn a child node process.
- [**startPowerShellScript**](./src/startPowerShellScript.ts): Executes a PowerShell script with arguments and returns stdout/stderr.
- [**streamToString**](./src/streamToString.ts): Drain a Readable into a string.
- [**timer**](./src/timer.ts): Executes a task and logs the execution time.
- [**toError**](./src/toError.ts): Converts the given value to an Error object. If the value is already an Error object, it is returned as is. If the value is not an Error object, it is converted to a string and used as the error message.

<!-- EXPORTS_END -->

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
