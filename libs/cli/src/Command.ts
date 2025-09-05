import { parseArgs } from 'node:util'
import type { ParseArgsOptionDescriptor } from 'node:util'
import type { IHelp } from './Help'
import { CommandHelpAdapter } from './CommandHelpAdapter'

/**
 * Command-line argument parser with fluent API and type-safe validation.
 * Enforces CLI argument ordering rules and provides structured parsing results.
 *
 * @example
 * ```typescript
 * const cmd = new Command('myapp')
 *   .argument('<input>', 'input file')
 *   .argument('[output]', 'output file', 'out.txt')
 *   .option('-v, --verbose', 'verbose output')
 *   .option('-f, --format <type>', 'output format')
 *
 * const result = cmd.parse(['input.txt', '-v', '-f', 'json'])
 * ```
 */
export class Command implements CommandDescriptor {
  /** Command name used for invocation */
  name: string
  /** Optional version string */
  version?: string
  /** Alternative names for this command */
  aliases: string[]
  /** Brief single-line description */
  summary?: string
  /** Full command description */
  description: string
  /** Whether command should be hidden from help */
  hidden?: boolean
  /** Group name for organizing commands in help */
  group?: string
  /** Parent command if this is a subcommand */
  parent: Command | null
  /** Child subcommands */
  commands: Command[]
  /** Positional arguments */
  arguments: ArgumentDescriptor[]
  /** Named options/flags */
  options: OptionDescriptor[]
  /** Help system configuration */
  helpConfiguration: Partial<IHelp>

  constructor(name: string, parent: Command | null = null) {
    this.name = name
    this.parent = parent
    this.aliases = []
    this.description = ''
    this.commands = []
    this.arguments = []
    this.options = []
    this.helpConfiguration = { showGlobalOptions: true, sortOptions: true, sortSubcommands: true }

    // Make parent non-enumerable for toJSON compatibility
    Object.defineProperty(this, 'parent', {
      value: parent,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  }

  /** Updates multiple command properties at once */
  setState(state: Partial<CommandDescriptor>) {
    Object.assign(this, state)
    return this
  }

  /** Serializes command to JSON, maintaining compatibility with previous state-based structure */
  toJSON() {
    const result = {
      name: this.name,
      version: this.version,
      aliases: this.aliases,
      summary: this.summary,
      description: this.description,
      hidden: this.hidden,
      group: this.group,
      commands: this.commands,
      arguments: this.arguments,
      options: this.options,
      helpConfiguration: this.helpConfiguration,
    }

    // Make parent non-enumerable to maintain compatibility
    Object.defineProperty(result, 'parent', {
      value: this.parent,
      writable: true,
      enumerable: false,
      configurable: true,
    })

    return result
  }

  /** Sets the command name */
  setName(name: string) {
    this.name = name
  }

  /** Sets command aliases, flattening nested arrays */
  setAliases(...aliases: (string | string[])[]) {
    this.aliases = aliases.flat()
    return this
  }

  /** Adds aliases to existing ones */
  addAliases(...aliases: (string | string[])[]) {
    this.aliases.push(...aliases.flat())
    return this
  }

  /** Sets the command version */
  setVersion(version?: string) {
    this.version = version
    return this
  }

  /** Sets the command summary */
  setSummary(summary?: string) {
    this.summary = summary
    return this
  }

  /** Sets command description, joining multiple lines */
  setDescription(...lines: string[]) {
    this.description = lines.join('\n')
    return this
  }

  /** Sets whether command is hidden from help */
  setHidden(hidden: boolean | undefined = true) {
    this.hidden = hidden
    return this
  }

  /** Sets the command group for help organization */
  setGroup(group?: Exclude<string, 'Options' | 'Global Options'>) {
    this.group = group
    return this
  }

  /** Sets the parent command */
  setParent(parent: Command | null) {
    this.parent = parent
    return this
  }

  /** Extends existing help configuration with new settings */
  extendHelpConfiguration(config: Partial<IHelp>) {
    this.helpConfiguration = { ...this.helpConfiguration, ...config }
    return this
  }

  /** Sets help configuration, using defaults if not provided */
  setHelpConfiguration(config?: Partial<IHelp>) {
    this.helpConfiguration = config
      ? { ...config }
      : { showGlobalOptions: true, sortOptions: true, sortSubcommands: true }
    return this
  }

  /** Creates and adds a subcommand */
  subcommand(name: string): Command {
    const sub = new Command(name, this)
    this.commands.push(sub)
    return sub
  }

  /** Add required argument. Usage: `<name>` */
  argument(usage: `<${string}>`, description: string, options?: ArgOpts<RequiredArgumentDescriptor>): this
  /** Add optional argument with default. Usage: `[name]` */
  argument(usage: `[${string}]`, description: string, options?: ArgOpts<OptionalArgumentDescriptor>): this
  /** Add required variadic argument. Usage: `<name...>` */
  argument(
    usage: `<${string}...>`,
    description: string,
    options?: ArgOpts<RequiredVariadicArgumentDescriptor>,
  ): this
  /** Add optional variadic argument with defaults. Usage: `[name...]` */
  argument(
    usage: `[${string}...]`,
    description: string,
    options?: ArgOpts<OptionalVariadicArgumentDescriptor>,
  ): this

  /**
   * Adds positional argument with type inference and CLI ordering validation.
   */
  argument<T extends ArgOpts<ArgumentDescriptor>, U extends ArgumentUsage>(
    usage: U,
    description: string,
    options: T = {} as T,
  ) {
    // Match <arg> or <arg...> or [arg] or [arg...]
    const match = usage.match(/^<(.*?)>$|^\[(.*?)\]$/)
    if (!match) throw new Error(`Invalid argument format: ${usage}`)
    const nameMatch = match[1] || match[2]
    const name = nameMatch.replace(/\.\.\.$/, '')
    this.assertArgumentNameNotInUse(name)
    if (usage.startsWith('<')) {
      if (nameMatch.endsWith('...')) {
        this.assertNoMultipleVariadicArguments()
        this.arguments.push({
          name,
          description,
          required: true,
          multiple: true,
          ...(options as ArgOpts<RequiredVariadicArgumentDescriptor>),
        })
      } else {
        this.assertNoOptionalOrVariadicArguments()
        this.arguments.push({
          name,
          description,
          required: true,
          multiple: false,
          ...(options as ArgOpts<RequiredArgumentDescriptor>),
        })
      }
    } else if (usage.startsWith('[')) {
      if (nameMatch.endsWith('...')) {
        this.assertNoMultipleVariadicArguments()
        this.arguments.push({
          name,
          description,
          required: false,
          multiple: true,
          defaultValue: (options.defaultValue ?? []) as string[],
          ...(options as ArgOpts<OptionalVariadicArgumentDescriptor>),
        })
      } else {
        this.assertNoVariadicArgument()
        this.arguments.push({
          name,
          description,
          required: false,
          multiple: false,
          ...(options as ArgOpts<OptionalArgumentDescriptor>),
        })
      }
    }
    return this
  }

  /** Add required string option. Usage: `-f, --file <path>` */
  option(
    usage: `-${string}, --${string} <${string}>`,
    description: string,
    options?: OptOpts<RequiredOptionDescriptor>,
  ): this
  /** Add optional string option with default. Usage: `-o, --output [path]` */
  option(
    usage: `-${string}, --${string} [${string}]`,
    description: string,
    options?: OptOpts<OptionalOptionDescriptor>,
  ): this
  /** Add required variadic option. Usage: `-i, --include <patterns...>` */
  option(
    usage: `-${string}, --${string} <${string}...>`,
    description: string,
    options?: OptOpts<RequiredVariadicOptionDescriptor>,
  ): this
  /** Add optional variadic option with defaults. Usage: `-e, --exclude [patterns...]` */
  option(
    usage: `-${string}, --${string} [${string}...]`,
    description: string,
    options?: OptOpts<OptionalVariadicOptionDescriptor>,
  ): this
  /** Add boolean flag option. Usage: `-v, --verbose` */
  option(usage: `-${string}, --${string}`, description: string, options?: OptOpts<BooleanOptionDescriptor>): this

  /**
   * Adds command-line option with type inference. Parses format: `-s, --long [<value>|[value]|<value...>|[value...]]`
   */
  option<T extends OptOpts<OptionDescriptor>, U extends OptionUsage>(
    usage: U,
    description: string,
    opts: T = {} as T,
  ) {
    // First try to match the general pattern to extract parts
    const match = usage.match(/^-(.+?), --([a-zA-Z][\w-]*)(?:\s*(<(.+?)>|\[(.+?)\]))?$/)
    if (!match) throw new Error(`Invalid option format: ${usage}`)
    const short = match[1]
    const name = match[2]
    this.assertOptionShortNameIsValid(short)
    this.assertOptionShortNameNotInUse(short)
    this.assertOptionNameNotInUse(name)

    const argName = (match[4] || match[5])?.replace(/\.\.\.$/, '')
    if (!argName) {
      this.options.push({
        type: 'boolean',
        short: short,
        name,
        description,
        required: false,
        multiple: false,
        ...(opts as OptOpts<BooleanOptionDescriptor>),
      })
    } else if (usage.endsWith('>')) {
      if (usage.endsWith('...>')) {
        this.options.push({
          type: 'string',
          short,
          name,
          argName,
          description,
          required: true,
          multiple: true,
          ...(opts as OptOpts<RequiredVariadicOptionDescriptor>),
        })
      } else {
        this.options.push({
          type: 'string',
          short,
          name,
          argName,
          description,
          required: true,
          multiple: false,
          ...(opts as OptOpts<RequiredOptionDescriptor>),
        })
      }
    } else if (usage.endsWith(']')) {
      if (usage.endsWith('...]')) {
        this.options.push({
          type: 'string',
          short,
          name,
          argName,
          description,
          required: false,
          multiple: true,
          defaultValue: (opts.defaultValue ?? []) as string[],
          ...(opts as OptOpts<OptionalVariadicOptionDescriptor>),
        })
      } else {
        this.options.push({
          type: 'string',
          short,
          name,
          argName,
          description,
          required: false,
          multiple: false,
          ...(opts as OptOpts<OptionalOptionDescriptor>),
        })
      }
    }

    return this
  }

  /**
   * Parses command-line arguments with subcommand support and type-safe validation.
   *
   * @example
   * ```typescript
   * const result = cmd.parse(['input.txt', '-v', '--format', 'json'])
   * // { arguments: ['input.txt'], options: { verbose: true, format: 'json' } }
   * ```
   */
  parse(
    argv: string[] = process.argv.slice(2),
    globalOptions: OptionDescriptor[] = [],
  ): {
    command: Command
    arguments: (string | string[])[]
    options: { [x: string]: string | boolean | (string | boolean)[] | undefined }
  } {
    // check if should parse subcommand
    const maybeSub = parseArgs({
      args: argv,
      allowPositionals: true,
      tokens: false,
      strict: false,
      allowNegative: true,
    }).positionals[0]
    const sub = this.commands.find((sub) => {
      return [sub.name, ...sub.aliases].includes(maybeSub)
    })
    if (sub) {
      return sub.parse(
        argv?.filter((a) => a !== maybeSub),
        [...globalOptions, ...this.options],
      )
    }

    // parse current command
    const optionsConfig = Object.fromEntries(
      [...globalOptions, ...this.options].map((o) => {
        return [o.name, o]
      }),
    )
    const parsed = parseArgs({
      args: argv,
      options: optionsConfig,
      allowPositionals: true,
      tokens: true,
      strict: true,
      allowNegative: true,
    })

    // Process tokens to handle variadic options that should consume multiple consecutive arguments
    const processedValues = { ...parsed.values }
    const processedPositionals = [...parsed.positionals]

    // Find variadic options and collect their consecutive arguments
    for (let i = 0; i < parsed.tokens.length; i++) {
      const token = parsed.tokens[i]
      if (token.kind === 'option') {
        const optionDescriptor = this.options.find((o) => o.name === token.name)
        if (optionDescriptor && optionDescriptor.multiple && optionDescriptor.type === 'string') {
          // This is a variadic option, collect consecutive positional arguments
          const values = [token.value] // Start with the option's own value
          let j = i + 1

          // Look for consecutive positionals
          while (j < parsed.tokens.length && parsed.tokens[j].kind === 'positional') {
            const positionalToken = parsed.tokens[j]
            if (positionalToken.kind === 'positional') {
              values.push(positionalToken.value)
              // Remove from processed positionals
              const posIndex = processedPositionals.indexOf(positionalToken.value)
              if (posIndex !== -1) {
                processedPositionals.splice(posIndex, 1)
              }
            }
            j++
          }

          // Update the option value with all collected values (filter out undefined)
          Reflect.set(
            processedValues,
            token.name,
            values.filter((v): v is string => v !== undefined),
          )
        }
      }
    }

    // Handle positional arguments
    const parsedArguments = this.arguments.map((arg, index) => {
      if (arg.multiple) {
        // Variadic argument gets all remaining positionals
        const remainingArgs = processedPositionals.slice(index)
        return remainingArgs.length > 0 ? remainingArgs : (arg.defaultValue ?? [])
      } else {
        // Regular argument gets positional at index or default
        return processedPositionals[index] ?? arg.defaultValue
      }
    })

    // Merge default option values with processed values
    const optionValues = { ...processedValues }
    for (const option of this.options) {
      if (!(option.name in optionValues) && 'defaultValue' in option) {
        Reflect.set(optionValues, option.name, option.defaultValue)
      }
    }

    return {
      command: this,
      arguments: parsedArguments,
      options: optionValues,
    }
  }

  /** Validates CLI argument ordering */
  protected assertNoOptionalOrVariadicArguments() {
    if (this.arguments.some((arg) => !arg.required)) {
      throw new Error('Cannot add required argument after optional or variadic arguments')
    }
  }

  /** Validates optional args don't follow variadic args */
  protected assertNoVariadicArgument() {
    if (this.arguments.some((arg) => arg.multiple)) {
      throw new Error('Cannot add optional argument after variadic argument')
    }
  }

  /** Ensures only one variadic argument per command */
  protected assertNoMultipleVariadicArguments() {
    if (this.arguments.some((arg) => arg.multiple)) {
      throw new Error('Cannot add more than one variadic argument')
    }
  }

  /** Ensures unique argument names across arguments and options */
  protected assertArgumentNameNotInUse(name: string) {
    if (this.arguments.some((arg) => arg.name === name)) {
      throw new Error(`Argument name already in use: ${name}`)
    }
    if (this.options.some((opt) => opt.name === name)) {
      throw new Error(`Argument name already in use: ${name}`)
    }
  }

  /** Validates option short names are single alphanumeric characters */
  protected assertOptionShortNameIsValid(short: string) {
    const isSingleAlphaNumericChar = /^[a-zA-Z0-9]$/.test(short)
    if (!isSingleAlphaNumericChar) {
      throw new Error(`Expected short name to be a single alpha-numeric character. Got: ${short}`)
    }
  }

  /** Validates option short names are unique across command hierarchy */
  protected assertOptionShortNameNotInUse(short: string) {
    for (const opt of this.options) {
      if (opt.short === short) {
        throw new Error(`Option short name already in use: -${short}`)
      }
    }
    this.parent?.assertOptionShortNameNotInUse(short)
  }

  /** Validates option names are unique across command hierarchy */
  protected assertOptionNameNotInUse(name: string) {
    if (this.options.some((opt) => opt.name === name)) {
      throw new Error(`Option name already in use: --${name}`)
    }
    this.parent?.assertOptionNameNotInUse(name)
  }

  /** Returns command and all ancestor commands in hierarchy */
  getCommandAndAncestors(): Command[] {
    const result = []
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let command: Command | null | undefined = this
    for (; command; command = command.parent) {
      result.push(command)
    }
    return result
  }

  /** Returns all ancestor commands excluding this command */
  getAncestors(): Command[] {
    return this.getCommandAndAncestors().slice(1)
  }

  /** Returns all options from this command and ancestors */
  getOptionsInclAncestors() {
    return this.getCommandAndAncestors().flatMap((cmd) => cmd.options)
  }

  /** Finds subcommand by name or alias */
  findCommand(this: Command, name: string) {
    if (!name) return undefined
    return this.commands.find((cmd) => cmd.name === name || cmd.aliases.includes(name))
  }

  /** Finds option by short or long name */
  findOption(this: Command, arg: string): OptionDescriptor | undefined {
    return this.options.find((option) => option.short === arg || option.name === arg)
  }

  /** Returns a view that is compliant with the CommandHelp interface */
  createHelpAdapter() {
    return new CommandHelpAdapter(this)
  }

  /** Renders formatted help text using provided help definition */
  renderHelp(help: IHelp): string {
    return this.createHelpAdapter().renderHelp(help)
  }
}

/** Usage patterns for boolean flag options */
type BooleanOptionUsage = `-${string}, --${string}`
/** Usage patterns for required string options */
type RequiredOptionUsage = `-${string}, --${string} <${string}>`
/** Usage patterns for optional string options */
type OptionalOptionUsage = `-${string}, --${string} [${string}]`
/** Usage patterns for required variadic options */
type RequiredVariadicOptionUsage = `-${string}, --${string} <${string}...>`
/** Usage patterns for optional variadic options */
type OptionalVariadicOptionUsage = `-${string}, --${string} [${string}...]`

/** Union of all option usage pattern types */
export type OptionUsage =
  | BooleanOptionUsage
  | RequiredOptionUsage
  | OptionalOptionUsage
  | RequiredVariadicOptionUsage
  | OptionalVariadicOptionUsage

/** Usage pattern for required positional arguments */
type RequiredArgumentUsage = `<${string}>`
/** Usage pattern for optional positional arguments */
type OptionalArgumentUsage = `[${string}]`
/** Usage pattern for required variadic arguments */
type RequiredVariadicArgumentUsage = `<${string}...>`
/** Usage pattern for optional variadic arguments */
type OptionalVariadicArgumentUsage = `[${string}...]`

/** Union of all argument usage pattern types */
export type ArgumentUsage =
  | RequiredArgumentUsage //
  | OptionalArgumentUsage
  | RequiredVariadicArgumentUsage
  | OptionalVariadicArgumentUsage

/** Base descriptor for command-line arguments with shared properties */
interface ArgumentDescriptorBase {
  name: string
  required: boolean
  description: string
  multiple: boolean
  choices?: string[]
  defaultValue?: string | string[] | never
  defaultValueDescription?: string | never
}

/** Required positional argument descriptor. Usage: `<name>` */
interface RequiredArgumentDescriptor extends ArgumentDescriptorBase {
  multiple: false
  required: true
  defaultValue?: never
  defaultValueDescription?: never
}

/** Optional positional argument with string default. Usage: `[name]` */
interface OptionalArgumentDescriptor extends ArgumentDescriptorBase {
  required: false
  multiple: false
  defaultValue?: string
  defaultValueDescription?: string
}

/** Required variadic argument accepting multiple values. Usage: `<name...>` */
interface RequiredVariadicArgumentDescriptor extends ArgumentDescriptorBase {
  required: true
  multiple: true
  defaultValue?: never
  defaultValueDescription?: never
}

/** Optional variadic argument with array default. Usage: `[name...]` */
interface OptionalVariadicArgumentDescriptor extends ArgumentDescriptorBase {
  required: false
  multiple: true
  defaultValue?: string[]
  defaultValueDescription?: string
}

/** Base descriptor for command-line options with shared properties */
interface OptionDescriptorBase extends ParseArgsOptionDescriptor {
  type: 'boolean' | 'string'
  short: string
  name: string
  argName?: string | never
  description: string
  required: boolean
  multiple: boolean
  defaultValue?: boolean | string | string[] | never
  defaultValueDescription?: string | never
  env?: string
  hidden?: boolean
  choices?: string[]
  group?: string
}

/** Boolean flag option. Usage: `-v, --verbose` */
interface BooleanOptionDescriptor extends OptionDescriptorBase {
  type: 'boolean'
  argName?: never
  required: false
  multiple: false
  defaultValue?: boolean
  defaultValueDescription?: string
}

/** Required string option. Usage: `-f, --file <path>` */
interface RequiredOptionDescriptor extends OptionDescriptorBase {
  type: 'string'
  argName: string
  required: true
  multiple: false
  defaultValue?: never
  defaultValueDescription?: never
}

/** Optional string option with default. Usage: `-o, --output [path]` */
interface OptionalOptionDescriptor extends OptionDescriptorBase {
  type: 'string'
  argName: string
  required: false
  multiple: false
  defaultValue?: string
  defaultValueDescription?: string
}

/** Required option accepting multiple values. Usage: `-i, --include <patterns...>` */
interface RequiredVariadicOptionDescriptor extends OptionDescriptorBase {
  type: 'string'
  argName: string
  required: true
  multiple: true
  defaultValue?: never
  defaultValueDescription?: never
}

/** Optional option accepting multiple values with defaults. Usage: `-e, --exclude [patterns...]` */
interface OptionalVariadicOptionDescriptor extends OptionDescriptorBase {
  type: 'string'
  argName: string
  required: false
  multiple: true
  defaultValue?: string[]
  defaultValueDescription?: string
}

/** Complete command configuration including all properties and substructures */
export interface CommandDescriptor {
  name: string
  version?: string
  aliases: string[]
  summary?: string
  description: string
  hidden?: boolean
  group?: string
  parent: Command | null
  commands: Command[]
  arguments: ArgumentDescriptor[]
  options: OptionDescriptor[]
  helpConfiguration: Partial<IHelp>
}

/** Union type for all argument descriptor variants */
export type ArgumentDescriptor =
  | RequiredArgumentDescriptor
  | OptionalArgumentDescriptor
  | RequiredVariadicArgumentDescriptor
  | OptionalVariadicArgumentDescriptor

/** Union type for all option descriptor variants */
export type OptionDescriptor =
  | BooleanOptionDescriptor
  | RequiredOptionDescriptor
  | OptionalOptionDescriptor
  | RequiredVariadicOptionDescriptor
  | OptionalVariadicOptionDescriptor

/** Helper type for extracting argument configuration options */
type ArgOpts<T extends ArgumentDescriptor> = Omit<T, 'name' | 'description' | 'required' | 'multiple'>

/** Helper type for extracting option configuration options */
type OptOpts<T extends OptionDescriptor> = Omit<
  T,
  'name' | 'description' | 'required' | 'multiple' | 'type' | 'argName' | 'short' | 'long'
>
