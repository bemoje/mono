# @mono/cli

A type-safe CLI builder focused on command composition and help generation without execution coupling. Parse arguments, generate help, and integrate with existing CLI frameworks through a clean, fluent API.

## Key Features

- **🎯 Composition-Focused**: Build command structures without execution logic - parse arguments and generate help only
- **🔒 Type-Safe**: Full TypeScript support with type inference for arguments and options
- **🚀 Focused API**: Streamlined interface designed specifically for parsing and help generation
- **🎨 Flexible Help**: Fork of commander.js Help class with enhanced API and adapter support
- **✅ Validation**: Built-in CLI argument ordering validation and name conflict detection
- **🔗 Commander.js Compatible**: Adapter allows using this Help system with existing commander.js commands

## Core Philosophy

While commander.js provides a comprehensive solution that combines command definition with action execution, `@mono/cli` takes a different approach by focusing purely on:

1. **Command Structure Definition** - Define arguments, options, and subcommands
2. **Argument Parsing** - Parse `process.argv` into structured data
3. **Help Generation** - Render formatted help text with customizable styling

This separation of concerns allows for architectures where CLI parsing logic is decoupled from business logic, making it ideal for scenarios where you want to handle argument parsing and action execution in separate layers.

## Quick Start

```ts
import { Command } from '@mono/cli'

// Define command structure
const cmd = new Command('myapp')
  .setVersion('1.0.0')
  .setDescription('My awesome CLI application')
  .argument('<input>', 'Input file path')
  .argument('[output]', 'Output file path', { defaultValue: 'out.txt' })
  .option('-v, --verbose', 'Enable verbose output')
  .option('-f, --format <type>', 'Output format', { choices: ['json', 'xml', 'yaml'] })

// Parse command line arguments
const result = cmd.parse(process.argv.slice(2))

console.log('Arguments:', result.arguments) // ['input.txt', 'out.txt']
console.log('Options:', result.options) // { verbose: true, format: 'json' }
console.log('Command:', result.command.name) // 'myapp'
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
cmd.argument('<input>', 'Input file path')

// Optional argument with default
cmd.argument('[output]', 'Output file path', { defaultValue: 'dist/output.txt' })

// Required variadic (multiple values)
cmd.argument('<files...>', 'Multiple input files')

// Optional variadic with defaults
cmd.argument('[patterns...]', 'Glob patterns', { defaultValue: ['**/*.js'] })
```

### Options (Named Parameters)

```ts
// Boolean flag
cmd.option('-v, --verbose', 'Enable verbose output')

// Required string option
cmd.option('-f, --format <type>', 'Output format')

// Optional string option with default
cmd.option('-o, --output [path]', 'Output directory', { defaultValue: 'dist' })

// Required variadic option
cmd.option('-i, --include <patterns...>', 'Include patterns')

// Optional variadic option with defaults
cmd.option('-e, --exclude [patterns...]', 'Exclude patterns', {
  defaultValue: ['node_modules', '.git'],
})

// Option with choices and environment variable
cmd.option('-l, --log-level [level]', 'Log level', {
  choices: ['error', 'warn', 'info', 'debug'],
  defaultValue: 'info',
  env: 'LOG_LEVEL',
})
```

### Global Options

Options defined on parent commands are available to subcommands:

```ts
const app = new Command('myapp').option('-c, --config <file>', 'Config file')

app.subcommand('build').option('-w, --watch', 'Watch mode')

// Both --config and --watch are available to 'build' subcommand
const result = app.parse(['build', '--config', 'myconfig.json', '--watch'])
```

### Subcommands

```ts
const cmd = new Command('git')

// Create subcommand
const add = cmd
  .subcommand('add')
  .setDescription('Add files to staging area')
  .argument('<files...>', 'Files to add')
  .option('-A, --all', 'Add all files')

const commit = cmd
  .subcommand('commit')
  .setDescription('Create a commit')
  .argument('[message]', 'Commit message')
  .option('-m, --message <msg>', 'Commit message')
  .option('-a, --all', 'Commit all changes')

// Parsing automatically routes to subcommands
const result = cmd.parse(['add', 'file1.js', 'file2.js', '-A'])
// result.command === add subcommand instance
```

## Parsing Results

The `parse()` method returns a structured result:

```ts
interface ParseResult {
  command: Command // The command that was executed (handles subcommands)
  arguments: unknown[] // Parsed positional arguments
  options: Record<string, unknown> // Parsed options/flags
}
```

### Argument Types

- **Single values**: `string`
- **Optional with defaults**: `string` (default applied if not provided)
- **Variadic**: `string[]` (array of values)

### Option Types

- **Boolean flags**: `boolean`
- **String options**: `string`
- **Variadic options**: `string[]`

## Help System

### Rendering Help

```ts
import { Help } from '@mono/cli'

// Use default help formatting
console.log(cmd.renderHelp())

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

## Commander.js Integration

Use the enhanced Help system with existing commander.js commands:

```ts
import { Command } from 'commander'
import { CommanderHelpAdapter } from '@mono/cli'

// Existing commander.js command
const commanderCmd = new Command('example')
  .description('Example commander.js command')
  .option('-v, --verbose', 'verbose output')

// Use enhanced help system
const adapter = new CommanderHelpAdapter(commanderCmd)
console.log(adapter.renderHelp())
```

## Custom Adapters

You can create your own adapters for any command system by implementing the `ICommandHelp` interface. This allows you to use the enhanced Help system with any CLI library or custom command structure.

### Creating Custom Adapters

**Example**: Adapter for a hypothetical CLI library:

```ts
import { ICommandHelp, IHelp, Help, renderHelp } from '@mono/cli'

class MyAdapter implements ICommandHelp {
  constructor(private cmd: SomeOtherCliCommand) {}

  // implement ICommandHelp interface methods
  get name() {
    return this.cmd.getName()
  }
  get commands() {
    return this.cmd.getSubcommands().map((sub) => {
      return new MyAdapter(sub)
    })
  }
  get options() {
    return this.cmd.getOptions().map((opt) => ({
      flags: opt.flags,
      //... map props
    }))
  }
  // etc...
}

const myCommand = new SomeOtherCliCommand('myapp')
const adapter = new MyAdapter(myCommand)
console.log(renderHelp(adapter, new Help()))
```

This pattern allows you to:

- **Bridge Different CLI Libraries**: Use the enhanced Help system with any command framework
- **Migrate Gradually**: Introduce better help formatting without rewriting existing commands
- **Standardize Help Output**: Consistent help formatting across different CLI tools in your project
- **Extend Legacy Systems**: Add modern help features to older CLI codebases

## Validation

Commands automatically validate:

- Argument ordering (required before optional before variadic)

```ts
cmd.argument('[optional]', 'Optional arg').argument('<required>', 'Required arg')
//=> ❌ Error!
```

- Unique option names and short flags, including globals across parent/child commands

```ts
cmd.option('-v, --verbose', 'Verbose output').option('-v, --video', 'Video mode')
//=> ❌ Error!
```

- Single variadic argument per command

```ts
cmd.argument('<files...>', 'First variadic').argument('<more...>', 'Second variadic')
//=> ❌ Error!
```

## State Management

Commands can be serialized and restored:

```ts
// Serialize command configuration
const state = cmd.toJSON()

// Restore from state
const restoredCmd = new Command('temp')
restoredCmd.setState(state)
```

## Command Class

**Constructor**:

```ts
- new Command(name: string, parent?: Command)
```

**Structure Methods**:

```ts
- argument(usage, description, options?): this
- option(usage, description, options?): this
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
- parse(argv?: string[], globalOptions?: OptionDescriptor[]): ParseResult
- renderHelp(help?: IHelp): string
```
