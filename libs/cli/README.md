# @bemoje/cli

A type-safe CLI framework for building command-line interfaces with typed arguments, options, subcommands, and auto-generated help - without execution coupling.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/cli
```

## Features

- **Full type inference** - Arguments, options, and parsed results are fully typed. The types update as you chain `.addArgument()` and `.addOption()` calls.
- **Declarative, chainable API** - Build commands fluently with method chaining; each call returns a narrowed type.
- **Subcommand hierarchies** - Nest commands arbitrarily deep. Options are inherited by subcommands. Aliases are auto-generated.
- **Auto-generated help** - Colorized, grouped, and wrapped help output from your command definitions. Fully customizable via the `Help` class.
- **Built-in `--help`, `--debug`, and `--version` flags** - Automatically added to root commands.
- **Option hooks** - Register side-effect actions that trigger when specific options are set (e.g., `--help` prints help and sets `process.exitCode`).
- **Parse-only design** - `parseArgv()` returns a result object with `args`, `opts`, `errors`, `hooks`, and an `execute()` method. You control when and whether execution happens.
- **Validation** - Missing required arguments, unknown options, and invalid choices are reported as errors on the result.
- **Variadic arguments and options** - Both arguments and options support variadic (`...`) syntax to collect multiple values into arrays.
- **Environment variable defaults** - Options can fall back to environment variables via the `env` option.
- **Argument and option choices** - Restrict allowed values with `choices` arrays; violations are reported as validation errors.
- **Negatable boolean flags** - Pass `--no-<flag>` to set a boolean option to `false`.
- **kebab-case to camelCase mapping** - Multi-word option names like `--output-dir` are automatically available as `opts.outputDir`.
- **Hidden commands and options** - Exclude items from help output while keeping them functional.
- **Grouped help sections** - Organize options and subcommands into named groups in the help output.

## Usage

### Basic Command

```ts
import { Command } from '@bemoje/cli'

const cli = new Command('greet')
  .setDescription('Greet someone')
  .addArgument('<name>')
  .addOption('-l, --loud', { description: 'Shout the greeting' })
  .setAction((name, opts) => {
    const msg = `Hello, ${name}!`
    console.log(opts.loud ? msg.toUpperCase() : msg)
  })

cli.parseArgv(process.argv.slice(2))
```

### Arguments

Arguments are positional values parsed from `argv`. They support required (`<name>`), optional (`[name]`), and variadic (`<name...>`, `[name...]`) forms.

```ts
const cmd = new Command('copy')
  .addArgument('<source>') // required string
  .addArgument('[destination]', { defaultValue: '.' }) // optional with default
  .setAction((source, destination, opts) => {
    console.log(`Copying ${source} to ${destination}`)
  })

cmd.parseArgv(['file.txt'])
// args: ['file.txt', '.']
```

**Variadic arguments** collect all remaining positional values into an array. Only the last argument may be variadic.

```ts
const cmd = new Command('concat').addArgument('<files...>').setAction((files, opts) => {
  // files is string[]
  console.log(`Concatenating: ${files.join(', ')}`)
})

cmd.parseArgv(['a.txt', 'b.txt', 'c.txt'])
// args: [['a.txt', 'b.txt', 'c.txt']]
```

**Choices** can restrict which values are accepted:

```ts
const cmd = new Command('deploy').addArgument('<env>', { choices: ['dev', 'staging', 'prod'] })
```

**Ordering rules** are enforced at both the type level and at runtime:

- Required arguments must come before optional ones
- Only the last argument may be variadic
- A command with arguments cannot have subcommands (and vice versa)

### Options

Options are named flags parsed from `argv`. The format is always `-<short>, --<long> [value-syntax]`.

```ts
const cmd = new Command('build')
  .addOption('-o, --output <dir>', { description: 'Output directory' }) // required string
  .addOption('-m, --minify', { description: 'Minify output' }) // boolean flag
  .addOption('-w, --watch [mode]', { description: 'Watch mode', defaultValue: 'poll' }) // optional string with default
  .setAction((opts) => {
    console.log(opts.output) // string
    console.log(opts.minify) // boolean | undefined
    console.log(opts.watch) // string
  })
```

**Variadic options** collect multiple values into an array:

```ts
const cmd = new Command('lint')
  .addOption('-i, --include <patterns...>', { description: 'Include globs' }) // required: string[]
  .addOption('-e, --exclude [patterns...]', { description: 'Exclude globs', defaultValue: ['node_modules'] })

cmd.parseArgv(['-i', 'src', 'lib', '-e', 'test'])
// opts.include: ['src', 'lib']
// opts.exclude: ['test']
```

**Option choices** restrict valid values:

```ts
const cmd = new Command('format').addOption('-f, --format <type>', {
  description: 'Output format',
  choices: ['json', 'xml', 'yaml'],
})
```

**Environment variable defaults** let options fall back to env vars:

```ts
const cmd = new Command('deploy').addOption('-t, --token <value>', {
  description: 'Auth token',
  env: 'AUTH_TOKEN',
})
// If AUTH_TOKEN is set and --token is not passed, opts.token defaults to process.env.AUTH_TOKEN
```

**Hidden options** are excluded from help output:

```ts
const cmd = new Command('tool').addOption('-x, --experimental', {
  description: 'Experimental feature',
  hidden: true,
})
```

**Grouped options** appear under custom headings in help:

```ts
const cmd = new Command('server')
  .addOption('-p, --port <n>', { description: 'Port number', group: 'Network:' })
  .addOption('-H, --host [addr]', { description: 'Host address', group: 'Network:' })
  .addOption('-v, --verbose', { description: 'Verbose logging', group: 'Logging:' })
```

**Negatable flags** - any boolean option can be negated with `--no-<name>`:

```ts
const cmd = new Command('build').addOption('-c, --color', { description: 'Colorize output' })

cmd.parseArgv(['--no-color'])
// opts.color: false
```

**kebab-case to camelCase** - multi-word option names are automatically camelCased:

```ts
const cmd = new Command('build').addOption('-o, --output-dir <path>', { description: 'Output directory' })

cmd.parseArgv(['--output-dir', '/tmp'])
// opts.outputDir: '/tmp'
```

### Subcommands

Use `.command()` to create a subcommand and get it back, or `.addCommand()` to add one via callback and get the parent back for chaining.

Options defined on the parent are automatically inherited by subcommands. Aliases are auto-generated from subcommand name initials (e.g., `build-project` gets alias `bp`).

```ts
const cli = new Command('git')
  .setDescription('A version control system')
  .addOption('-v, --verbose', { description: 'Verbose output' })

  .addCommand('clone', (sub) =>
    sub
      .setDescription('Clone a repository')
      .addArgument('<url>')
      .addOption('-d, --depth <n>', { description: 'Shallow clone depth' })
      .setAction((url, opts) => {
        // opts.verbose is inherited from parent
        console.log(`Cloning ${url} with depth ${opts.depth ?? 'full'}`)
      }),
  )

  .addCommand('status', (sub) =>
    sub
      .setDescription('Show working tree status')
      .addOption('-s, --short', { description: 'Short format output' })
      .setAction((opts) => {
        console.log('Status:', opts.short ? 'clean' : 'On branch main...')
      }),
  )

cli.parseArgv(['clone', 'https://github.com/user/repo', '-d', '1'])
```

**Aliases** can also be set manually:

```ts
const cli = new Command('app')
cli.command('install').setAliases('i', 'add')
```

### Parsing and Execution

`parseArgv()` does not execute the action - it returns a result object:

```ts
const cli = new Command('tool')
  .addArgument('<input>')
  .addOption('-v, --verbose', { description: 'Verbose' })
  .setAction((input, opts) => {
    console.log(`Processing ${input}`)
  })

const result = cli.parseArgv(['file.txt', '-v'])

result.path // string[] - subcommand path segments
result.name // string   - command name
result.argv // string[] - the argv that was parsed
result.args // [string] - typed parsed arguments
result.opts // { verbose: true } - typed parsed options
result.errors // string[] | undefined - validation errors
result.hooks // HookDefinition[] - triggered hooks
result.cmd // Command - the matched command instance

// Execute the action (and any triggered hooks) when you're ready:
await result.execute()
```

**Validation errors** are collected, not thrown. Check `result.errors` before executing:

```ts
const result = cli.parseArgv([])
if (result.errors) {
  console.error(result.errors.join('\n'))
  process.exitCode = 1
} else {
  await result.execute()
}
```

When `execute()` is called, hooks run first (in order). If any hook sets `process.exitCode`, execution stops. Then the main action runs inside a timer that provides a logger.

### Option Hooks

Hooks let you attach side-effect actions that run when a specific option is set. The built-in `--help`, `--debug`, and `--version` flags are all implemented as hooks.

```ts
const cli = new Command('tool')
  .addOption('-c, --clean', { description: 'Clean before running' })
  .addOptionHook('clean', ({ cmd, opts }) => {
    console.log('Cleaning build artifacts...')
    // Hook runs before the main action
  })
  .setAction((opts) => {
    console.log('Running tool...')
  })
```

Hooks are evaluated in registration order. If a hook sets `process.exitCode`, subsequent hooks and the main action are skipped.

### Help Output

Help is auto-generated with ANSI color support, word wrapping, and section grouping.

```ts
const cli = new Command('my-tool')
  .setVersion('1.0.0')
  .setDescription('A great CLI tool')
  .addArgument('<input>')
  .addOption('-v, --verbose', { description: 'Verbose output' })

// Render help string (with ANSI colors)
console.log(cli.renderHelp())

// Render plain text (no ANSI)
console.log(cli.renderHelp({ noColor: true }))
```

**Customize help rendering** via `.helpConfiguration()`:

```ts
cli.helpConfiguration((help) => {
  help.sortSubcommands = false
  help.sortOptions = false
  help.helpWidth = 120
})
```

The `Help` class exposes many styleable and overridable methods for full control over the output format:

| Method                      | Purpose                                       |
| --------------------------- | --------------------------------------------- |
| `styleTitle(str)`           | Style section headings ("Usage:", "Options:") |
| `styleUsage(str)`           | Style the usage line                          |
| `styleOptionTerm(str)`      | Style option flags                            |
| `styleSubcommandTerm(str)`  | Style subcommand entries                      |
| `styleArgumentTerm(str)`    | Style argument entries                        |
| `styleDescriptionText(str)` | Base style for all descriptions               |
| `formatItem(term, w, desc)` | Format a term/description pair with padding   |
| `boxWrap(str, width)`       | Wrap text at whitespace to fit width          |

### Type Safety

The `Command` class tracks argument and option types through generics that update with each chained call. This means your action handler receives correctly typed parameters:

```ts
const cmd = new Command('example')
  .addArgument('<name>') // A = [string]
  .addArgument('[count]', { defaultValue: '1' }) // A = [string, string]
  .addOption('-v, --verbose', {}) // O = { verbose?: boolean, ... }
  .addOption('-f, --format <type>', {}) // O = { verbose?: boolean, format: string, ... }
  .setAction((name, count, opts) => {
    // name: string, count: string, opts: { verbose?: boolean, format: string, ... }
  })
```

Invalid argument orderings (e.g., required after optional, anything after variadic) are caught at the **type level** - TypeScript will reject the code before it runs.

### Helpers

```ts
import {
  findCommand,
  findOption,
  parseOptionFlags,
  getCommandAncestors,
  getCommandAndAncestors,
} from '@bemoje/cli'

// Find a subcommand by name or alias
const sub = findCommand(cli, 'clone') // Command | undefined
const sub2 = findCommand(cli, 'c') // also works with aliases

// Find an option by name, short flag, or long flag
const opt = findOption(cli, 'verbose') // Option | undefined
const opt2 = findOption(cli, '-v') // by short flag
const opt3 = findOption(cli, '--verbose') // by long flag

// Parse raw flag syntax into components
parseOptionFlags('-o, --output <dir>')
// => { short: 'o', long: 'output', name: 'output', argName: 'dir' }

// Navigate command hierarchy
getCommandAncestors(sub) // parent commands (excluding self)
getCommandAndAncestors(sub) // [self, parent, grandparent, ...]
```

## API Reference

### `Command` Class

#### Constructor

| Method              | Description                               |
| ------------------- | ----------------------------------------- |
| `new Command(name)` | Create a new root command with given name |

#### Configuration

| Method                      | Returns | Description                                       |
| --------------------------- | ------- | ------------------------------------------------- |
| `.setName(name)`            | `void`  | Rename the command                                |
| `.setDescription(...lines)` | `this`  | Set full description (lines are joined with `\n`) |
| `.setSummary(text)`         | `this`  | Set brief one-line summary for command listings   |
| `.setVersion(version)`      | `this`  | Set version and add `--version` flag              |
| `.setHidden(hidden?)`       | `this`  | Hide from help listings                           |
| `.setGroup(group)`          | `this`  | Set category for help organization                |
| `.setAliases(...aliases)`   | `this`  | Replace all aliases                               |
| `.addAliases(...aliases)`   | `this`  | Append aliases                                    |
| `.helpConfiguration(cb?)`   | `this`  | Configure `Help` instance via callback            |

#### Arguments

| Method                          | Returns        | Description               |
| ------------------------------- | -------------- | ------------------------- |
| `.addArgument(usage, options?)` | `Command<...>` | Add a positional argument |

Argument usage patterns: `<name>` (required), `[name]` (optional), `<name...>` (required variadic), `[name...]` (optional variadic).

Argument options: `description`, `choices`, `defaultValue`, `defaultValueDescription`.

#### Options

| Method                        | Returns        | Description                            |
| ----------------------------- | -------------- | -------------------------------------- |
| `.addOption(flags, options?)` | `Command<...>` | Add a named option with type inference |

Option flag patterns: `-s, --long` (boolean), `-s, --long <val>` (required string), `-s, --long [val]` (optional string), `-s, --long <val...>` (required variadic), `-s, --long [val...]` (optional variadic).

Option properties: `description`, `defaultValue`, `defaultValueDescription`, `choices`, `env`, `hidden`, `group`.

#### Subcommands

| Method                  | Returns   | Description                                   |
| ----------------------- | --------- | --------------------------------------------- |
| `.command(name, cb?)`   | `Command` | Create subcommand, return the subcommand      |
| `.addCommand(name, cb)` | `this`    | Create subcommand via callback, return parent |

#### Actions and Hooks

| Method                           | Returns | Description                                |
| -------------------------------- | ------- | ------------------------------------------ |
| `.setAction(fn)`                 | `this`  | Set main action handler                    |
| `.addOptionHook(optionName, fn)` | `this`  | Register hook triggered when option is set |

#### Parsing

| Method              | Returns           | Description                               |
| ------------------- | ----------------- | ----------------------------------------- |
| `.parseArgv(argv?)` | `ParseArgvResult` | Parse argv and return result with execute |
| `.renderHelp(cfg?)` | `string`          | Render help text                          |

### Helper Functions

| Export                   | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| `findCommand(cmd, name)` | Find subcommand by name or alias                               |
| `findOption(cmd, name)`  | Find option by name, `-short`, or `--long`                     |
| `getCommandAncestors`    | Get all parent commands (excluding self)                       |
| `getCommandAndAncestors` | Get self and all parent commands                               |
| `parseOptionFlags`       | Parse flag syntax string into `{ short, long, name, argName }` |

### `Help` Class

Renders formatted, colorized help text. Instantiated automatically by `Command`. Override style methods by subclassing or via `helpConfiguration()`.

Key properties: `helpWidth`, `sortSubcommands`, `sortOptions`, `minWidthToWrap`.

### Types

| Type                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `ParseArgvResult`   | Return type of `parseArgv()` with args, opts, execute, etc.  |
| `ActionHandler`     | Action function signature receiving args, opts, and metadata |
| `HookActionHandler` | Hook function signature receiving parse context              |
| `HookDefinition`    | Hook with name, predicate, and action                        |
| `Argument`          | Argument descriptor                                          |
| `Option`            | Option descriptor                                            |
| `ICommand`          | Command interface for loose coupling                         |
| `IHelp`             | Help interface                                               |
