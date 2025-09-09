# @mono/cli

A type-safe CLI composer that can parse argv and generate help without execution coupling.

## Key Features

- **🎯 Composition-Focused**: Build command structures without execution logic.
- **🔒 Type-Safe**: Full TypeScript support with type inference for arguments and options
- **🎨 Flexible Help**: Fork of commander.js Help class with enhanced API and adapter support
- **✅ Validation**: Built-in CLI argument ordering validation and name conflict detection

## Quick Start

```ts
import { Command } from '@mono/cli'

const cmd = new Command('myapp')
  .setVersion('1.0.0')
  .setDescription('My awesome CLI application')
  .addArgument('<input>', 'Input file path')
  .addArgument('[output]', 'Output file path', { defaultValue: 'out.txt' })
  .addOption('-v, --verbose', 'Enable verbose output')
  .addOption('-f, --format <type>', 'Output format', { choices: ['json', 'xml', 'yaml'] })

console.log(cmd.parseArgv(['input.txt', '-v', '-f', 'json']))
// {
//   command: [Getter],
//   arguments: [ 'input.txt', 'out.txt' ],
//   options: { verbose: true, format: 'json' }
// }
```

## Command Definition

### Basic Setup

```ts
const cmd = new Command('myapp')
  .setVersion('1.0.0')
  .setDescription('Application description')
  .setSummary('Short summary for help')
  .setAliases(['app', 'my-app'])
```

### Arguments (Positional)

Arguments follow strict ordering rules: required → optional → variadic

```ts
// Required argument
cmd.addArgument('<input>', 'Input file path')

// Optional argument with default
cmd.addArgument('[output]', 'Output file path', { defaultValue: 'dist/output.txt' })

// Required variadic (multiple values)
cmd.addArgument('<files...>', 'Multiple input files')

// Optional variadic with defaults
cmd.addArgument('[patterns...]', 'Glob patterns', { defaultValue: ['**/*.js'] })
```

### Options (Named Parameters)

```ts
// Boolean flag
cmd.addOption('-v, --verbose', 'Enable verbose output')

// Required string option
cmd.addOption('-f, --format <type>', 'Output format')

// Optional string option with default
cmd.addOption('-o, --output [path]', 'Output directory', { defaultValue: 'dist' })

// Required variadic option
cmd.addOption('-i, --include <patterns...>', 'Include patterns')

// Optional variadic option with defaults
cmd.addOption('-e, --exclude [patterns...]', 'Exclude patterns', {
  defaultValue: ['node_modules', '.git'],
})

// Option with choices and environment variable
cmd.addOption('-l, --log-level [level]', 'Log level', {
  choices: ['error', 'warn', 'info', 'debug'],
  defaultValue: 'info',
  env: 'LOG_LEVEL',
})
```

### Global Options

Options defined on parent commands are available to subcommands:

```ts
const app = new Command('myapp').addOption('-c, --config <file>', 'Config file')

app.subcommand('build').addOption('-w, --watch', 'Watch mode')

// Both --config and --watch are available to 'build' subcommand
const result = app.parseArgv(['build', '--config', 'myconfig.json', '--watch'])
```

### Subcommands

```ts
const cmd = new Command('git')

// Create subcommand
const add = cmd
  .subcommand('add')
  .setDescription('Add files to staging area')
  .addArgument('<files...>', 'Files to add')
  .addOption('-A, --all', 'Add all files')

const commit = cmd
  .subcommand('commit')
  .setDescription('Create a commit')
  .addArgument('[message]', 'Commit message')
  .addOption('-m, --message <msg>', 'Commit message')
  .addOption('-a, --all', 'Commit all changes')

// Parsing automatically routes to subcommands
const result = cmd.parseArgv(['add', 'file1.js', 'file2.js', '-A'])
// result.command === add subcommand instance
```

## Help System

### Rendering Help

```ts
import { Help } from '@mono/cli'

// Use help formatting (requires Help instance)
const help = new Help()
console.log(cmd.renderHelp(help))

// Customize help configuration
const customHelp = new Help()
customHelp.helpWidth = 100
customHelp.sortOptions = true
customHelp.showGlobalOptions = true
console.log(cmd.renderHelp(customHelp))
```

### Help Configuration

Configure help behavior per command:

```ts
cmd.setHelpConfiguration({
  sortOptions: true,
  sortSubcommands: true,
  showGlobalOptions: false,
  helpWidth: 80,
})
```

### Custom Help Styling

It may be more convenient to extend the Help class for more extensive customization.

```ts
import { Help } from '@mono/cli'

class ColoredHelp extends Help {
  styleTitle(str: string): string {
    return `\x1b[1m${str}\x1b[0m` // Bold
  }

  styleOptionText(str: string): string {
    return `\x1b[36m${str}\x1b[0m` // Cyan
  }

  styleArgumentText(str: string): string {
    return `\x1b[33m${str}\x1b[0m` // Yellow
  }
}

console.log(cmd.renderHelp(new ColoredHelp()))
```

## Validation

Commands automatically validate:

- Argument ordering (required before optional before variadic)

```ts
cmd.addArgument('[optional]', 'Optional arg').addArgument('<required>', 'Required arg')
//=> ❌ Error!
```

- Unique option names and short flags, including globals across parent/child commands

```ts
cmd.addOption('-v, --verbose', 'Verbose output').addOption('-v, --video', 'Video mode')
//=> ❌ Error!
```

- Single variadic argument per command

```ts
cmd.addArgument('<files...>', 'First variadic').addArgument('<more...>', 'Second variadic')
//=> ❌ Error!
```

## Command Class

**Constructor**:

```ts
- new (name: string, parent?: Command): Command
```

**Structure Methods**:

```ts
- addArgument(usage, description, options?): this
- addOption(usage, description, options?): this
- subcommand(name: string): Command
```

**Configuration Methods**:

```ts
- setVersion(version?: string): this
- setName(name: string): this
- setDescription(...lines: string[]): this
- setSummary(summary?: string): this
- setHidden(hidden?: boolean): this
- setGroup(group?: string): this
- setHelpConfiguration(config?: Partial<IHelp>): this
- extendHelpConfiguration(config: Partial<IHelp>): this
- setAliases(...aliases: (string | string[])[]): this
- addAliases(...aliases: (string | string[])[]): this
- setParent(parent: Command | null): this
```

**Parsing & Help**:

```ts
- parseArgv(argv?: string[], globalOptions?: OptionDescriptor[]): ParseResult
- renderHelp(help: IHelp): string
```
