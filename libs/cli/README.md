# @bemoje/cli

A type-safe CLI framework for building command-line interfaces with typed arguments, options, subcommands, and auto-generated help - without execution coupling.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/cli
```

## Features

- Fully type-safe arguments, options, and parsed results
- Declarative, chainable API
- Subcommand hierarchies
- Auto-generated help and version output
- Hooks for option-driven side effects
- Parse-only design - no execution coupling

## Usage

### Basic Command

```ts
import { Command } from '@bemoje/cli'

const cli = new Command('greet')
  .description('Greet someone')
  .argument('<name>', 'Name of the person to greet')
  .option('-l, --loud', 'Shout the greeting')
  .setAction((name, options) => {
    const msg = `Hello, ${name}!`
    console.log(options.loud ? msg.toUpperCase() : msg)
  })

cli.parseArgv(process.argv)
```

### Subcommands

```ts
import { Command } from '@bemoje/cli'

const cli = new Command('git')
  .description('A version control system')

  .addSubcommand('clone', (sub) =>
    sub
      .description('Clone a repository')
      .argument('<url>', 'Repository URL')
      .option('--depth <n>', 'Shallow clone depth')
      .setAction((url, options) => {
        console.log(`Cloning ${url} with depth ${options.depth ?? 'full'}`)
      }),
  )

  .addSubcommand('status', (sub) =>
    sub
      .description('Show working tree status')
      .option('-s, --short', 'Short format output')
      .setAction((options) => {
        console.log('Status:', options.short ? 'clean' : 'On branch main...')
      }),
  )

cli.parseArgv(process.argv)
```

### Options with Values

```ts
import { Command } from '@bemoje/cli'

const cli = new Command('build')
  .description('Build the project')
  .option('-o, --output <dir>', 'Output directory', { defaultValue: 'dist' })
  .option('-m, --minify', 'Minify output')
  .option('--target <targets...>', 'Build targets (variadic)')
  .setAction((options) => {
    console.log(`Building to ${options.output}`)
    console.log(`Minify: ${options.minify}`)
    console.log(`Targets: ${options.target}`)
  })

cli.parseArgv(['node', 'build', '--output', 'out', '--minify', '--target', 'es2020', 'node18'])
```

### Help Output

Help is auto-generated from your command definitions:

```ts
const cli = new Command('my-tool')
  .version('1.0.0')
  .description('A great CLI tool')
  .argument('<input>', 'Input file')
  .option('-v, --verbose', 'Verbose output')

console.log(cli.renderHelp())
```

### Helpers

```ts
import { findCommand, findOption, parseOptionFlags } from '@bemoje/cli'

// Find a subcommand by name
const sub = findCommand(cli, 'clone')

// Find an option by flag
const opt = findOption(cli, '--output')

// Parse raw flag syntax
parseOptionFlags('-o, --output <dir>')
// => { short: '-o', long: '--output', argName: 'dir', ... }
```

## API Reference

| Export                   | Description                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| `Command`                | Main class for defining commands, arguments, options, and subcommands |
| `Help`                   | Help text formatter and renderer                                      |
| `findCommand`            | Locate a subcommand by name                                           |
| `findOption`             | Find an option definition by flag                                     |
| `getCommandAncestors`    | Get all ancestor commands                                             |
| `getCommandAndAncestors` | Get a command and its ancestors                                       |
| `parseOptionFlags`       | Parse option flag syntax strings                                      |
