import { parseArgs } from 'node:util'
import type { ParseArgsOptionDescriptor } from 'node:util'
import { Help, type IHelp } from './Help'
import type { AllUnionFields } from 'type-fest'

/**
 * Command-line argument parser with fluent API and type-safe validation.
 * Enforces CLI argument ordering rules and provides structured parsing results.
 *
 * @example
 * ```typescript
 * const cmd = new Command('myapp')
 *   .addArgument('<input>', 'input file')
 *   .addArgument('[output]', 'output file', 'out.txt')
 *   .addOption('-v, --verbose', 'verbose output')
 *   .addOption('-f, --format <type>', 'output format')
 *
 * cmd.parseArgv(['input.txt', '-v', '-f', 'json'])
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

  constructor(name: string = '', parent: Command | null = null) {
    this.name = name
    this.parent = parent
    this.aliases = []
    this.description = ''
    this.commands = []
    this.arguments = []
    this.options = []
    this.helpConfiguration = { showGlobalOptions: true, sortOptions: true, sortSubcommands: true }

    // Make parent non-enumerable for toJSON compatibility
    Object.defineProperty(this, 'parent', { enumerable: false })
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

  /** Sets command description, joining variadic lines */
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
  addSubcommand(name: string): Command {
    const sub = this.createCommand(name, this)
    this.commands.push(sub)
    return sub
  }

  /** Add required argument. Usage: `<name>` */
  addArgument(usage: `<${string}>`, description: string, options?: ArgOpts<RequiredArgumentDescriptor>): this
  /** Add optional argument with default. Usage: `[name]` */
  addArgument(usage: `[${string}]`, description: string, options?: ArgOpts<OptionalArgumentDescriptor>): this
  /** Add required variadic argument. Usage: `<name...>` */
  addArgument(
    usage: `<${string}...>`,
    description: string,
    options?: ArgOpts<RequiredVariadicArgumentDescriptor>,
  ): this
  /** Add optional variadic argument with defaults. Usage: `[name...]` */
  addArgument(
    usage: `[${string}...]`,
    description: string,
    options?: ArgOpts<OptionalVariadicArgumentDescriptor>,
  ): this

  /**
   * Adds positional argument with type inference and CLI ordering validation.
   */
  addArgument<T extends ArgOpts<ArgumentDescriptorStrict>, U extends ArgumentUsage>(
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
    const props = { name, description }
    if (usage.startsWith('<')) {
      if (nameMatch.endsWith('...')) {
        this.assertNoMultipleVariadicArguments()
        this.arguments.push({
          ...(options as ArgOpts<RequiredVariadicArgumentDescriptor>),
          ...props,
          required: true,
          variadic: true,
        })
      } else {
        this.assertNoOptionalOrVariadicArguments()
        this.arguments.push({
          ...(options as ArgOpts<RequiredArgumentDescriptor>),
          ...props,
          required: true,
          variadic: false,
        })
      }
    } else if (usage.startsWith('[')) {
      if (nameMatch.endsWith('...')) {
        this.assertNoMultipleVariadicArguments()
        this.arguments.push({
          ...(options as ArgOpts<OptionalVariadicArgumentDescriptor>),
          ...props,
          required: false,
          variadic: true,
          defaultValue: (options.defaultValue ?? []) as string[],
        })
      } else {
        this.assertNoVariadicArgument()
        this.arguments.push({
          ...(options as ArgOpts<OptionalArgumentDescriptor>),
          ...props,
          required: false,
          variadic: false,
        })
      }
    }
    return this
  }

  /** Add required string option. Usage: `-f, --file <path>` */
  addOption(
    flags: `-${string}, --${string} <${string}>`,
    description: string,
    options?: OptOpts<RequiredOptionDescriptor>,
  ): this
  /** Add optional string option with default. Usage: `-o, --output [path]` */
  addOption(
    flags: `-${string}, --${string} [${string}]`,
    description: string,
    options?: OptOpts<OptionalOptionDescriptor>,
  ): this
  /** Add required variadic option. Usage: `-i, --include <patterns...>` */
  addOption(
    flags: `-${string}, --${string} <${string}...>`,
    description: string,
    options?: OptOpts<RequiredVariadicOptionDescriptor>,
  ): this
  /** Add optional variadic option with defaults. Usage: `-e, --exclude [patterns...]` */
  addOption(
    flags: `-${string}, --${string} [${string}...]`,
    description: string,
    options?: OptOpts<OptionalVariadicOptionDescriptor>,
  ): this
  /** Add boolean flag option. Usage: `-v, --verbose` */
  addOption(
    flags: `-${string}, --${string}`,
    description: string,
    options?: OptOpts<BooleanOptionDescriptor>,
  ): this

  /**
   * Adds command-line option with type inference. Parses format: `-s, --long [<value>|[value]|<value...>|[value...]]`
   */
  addOption<T extends OptOpts<OptionDescriptorStrict>, U extends OptionUsage>(
    flags: U,
    description: string,
    opts: T = {} as T,
  ) {
    const match = flags.match(/^-(.+?), --([a-zA-Z][\w-]*)(?:\s*(<(.+?)>|\[(.+?)\]))?$/)
    if (!match) throw new Error(`Invalid option format: ${flags}`)
    const short = match[1]
    this.assertOptionShortNameIsValid(short)
    this.assertOptionShortNameNotInUse(short)
    const name = match[2]
    const argName = (match[4] || match[5])?.replace(/\.\.\.$/, '')
    this.assertOptionNameNotInUse(name)
    const props = {
      flags,
      short,
      long: name,
      name,
      description,
    }

    if (!argName) {
      this._addOption({
        type: 'boolean',
        ...(opts as OptOpts<BooleanOptionDescriptor>),
        ...props,
        negate: false,
        optional: true,
        variadic: false,
        get multiple() {
          return this.variadic
        },
      })
    } else if (flags.endsWith('>')) {
      if (flags.endsWith('...>')) {
        this._addOption({
          type: 'string',
          ...(opts as OptOpts<RequiredVariadicOptionDescriptor>),
          ...props,
          argName,
          required: true,
          optional: false,
          variadic: true,
          get multiple() {
            return this.variadic
          },
        })
      } else {
        this._addOption({
          type: 'string',
          ...(opts as OptOpts<RequiredOptionDescriptor>),
          ...props,
          argName,
          required: true,
          optional: false,
          variadic: false,
          get multiple() {
            return this.variadic
          },
        })
      }
    } else if (flags.endsWith(']')) {
      if (flags.endsWith('...]')) {
        this._addOption({
          type: 'string',
          ...(opts as OptOpts<OptionalVariadicOptionDescriptor>),
          ...props,
          argName,
          required: false,
          optional: true,
          variadic: true,
          get multiple() {
            return this.variadic
          },
          defaultValue: (opts.defaultValue ?? []) as string[],
        })
      } else {
        this._addOption({
          type: 'string',
          ...(opts as OptOpts<OptionalOptionDescriptor>),
          ...props,
          argName,
          required: false,
          optional: true,
          variadic: false,
          get multiple() {
            return this.variadic
          },
        })
      }
    }
    return this
  }

  private _addOption(opt: OptionDescriptorStrict) {
    this.options.push(opt)
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
  parseArgv(
    argv: string[] = process.argv.slice(2),
    globalOptions: OptionDescriptor[] = [],
  ): {
    command: Command
    arguments: (string | string[])[]
    options: { [x: string]: string | boolean | (string | boolean)[] | undefined }
  } {
    // navigate to subcommand if found
    const maybeSubArg = parseArgs({
      args: argv,
      allowPositionals: true,
      tokens: false,
      strict: false,
      allowNegative: true,
    }).positionals[0]
    const sub = this.findCommand(maybeSubArg)
    if (sub) {
      // recurse into subcommand
      return sub.parseArgv(
        argv?.filter((a) => a !== maybeSubArg),
        [...globalOptions, ...this.options],
      )
    }

    // parse
    const parsed = parseArgs({
      args: argv,
      options: Object.fromEntries(
        [...globalOptions, ...this.options].map((o) => {
          return [o.name, o] as const
        }),
      ),
      allowPositionals: true,
      tokens: true,
      strict: true,
      allowNegative: true,
    })

    // Find variadic options and collect their consecutive arguments
    for (let i = 0; i < parsed.tokens.length; i++) {
      const token = parsed.tokens[i]
      if (token.kind === 'option') {
        const optionDescriptor = this.options.find((o) => o.name === token.name)
        if (optionDescriptor && optionDescriptor.variadic && optionDescriptor.type === 'string') {
          // This is a variadic option, collect consecutive positional arguments
          const values = [token.value] // Start with the option's own value
          let j = i + 1

          // Look for consecutive positionals
          while (j < parsed.tokens.length && parsed.tokens[j].kind === 'positional') {
            const positionalToken = parsed.tokens[j]
            if (positionalToken.kind === 'positional') {
              values.push(positionalToken.value)
              // Remove from processed positionals
              const posIndex = parsed.positionals.indexOf(positionalToken.value)
              if (posIndex !== -1) {
                parsed.positionals.splice(posIndex, 1)
              }
            }
            j++
          }
          // Update the option value with all collected values (filter out undefined)
          Reflect.set(
            parsed.values,
            token.name,
            values.filter((v): v is string => v !== undefined),
          )
        }
      }
    }

    // Handle positional arguments
    const parsedArguments = this.arguments
      .map((arg, index) => {
        if (arg.variadic) {
          // Variadic argument gets all remaining positionals
          const remainingArgs = parsed.positionals.slice(index)
          return remainingArgs.length > 0 ? remainingArgs : (arg.defaultValue ?? [])
        } else {
          // Regular argument gets positional at index or default
          return parsed.positionals[index] ?? arg.defaultValue
        }
      })
      .filter((arg) => arg !== undefined)

    // Merge default option values with parsed options
    for (const option of this.options) {
      if (!(option.name in parsed.values) && 'defaultValue' in option) {
        Reflect.set(parsed.values, option.name, option.defaultValue)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return {
      get command() {
        return self
      },
      arguments: parsedArguments,
      options: { ...parsed.values },
    }
  }

  /** Renders formatted help text using provided help definition */
  renderHelp(help: IHelp = new Help()): string {
    const helper = Object.assign(help, this.helpConfiguration)
    return helper.formatHelp(this, helper)
  }

  /** Validates CLI argument ordering */
  protected assertNoOptionalOrVariadicArguments() {
    if (this.arguments.some((arg) => !arg.required)) {
      throw new Error('Cannot add required argument after optional or variadic arguments')
    }
  }

  /** Validates optional args don't follow variadic args */
  protected assertNoVariadicArgument() {
    if (this.arguments.some((arg) => arg.variadic)) {
      throw new Error('Cannot add optional argument after variadic argument')
    }
  }

  /** Ensures only one variadic argument per command */
  protected assertNoMultipleVariadicArguments() {
    if (this.arguments.some((arg) => arg.variadic)) {
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

  /** Returns a new Command instance. Override this method in subclasses. */
  createCommand(name: string = '', parent: Command | null = null) {
    return new Command(name, parent)
  }
}

/** Union of all option usage pattern types */
type OptionUsage =
  // boolean flag
  | `-${string}, --${string}`
  // required string option
  | `-${string}, --${string} <${string}>`
  // optional string option
  | `-${string}, --${string} [${string}]`
  // required variadic option
  | `-${string}, --${string} <${string}...>`
  // optional variadic option
  | `-${string}, --${string} [${string}...]`

/** Union of all argument usage pattern types */
type ArgumentUsage =
  // required argument
  | `<${string}>`
  // optional argument
  | `[${string}]`
  // required variadic argument
  | `<${string}...>`
  // optional variadic argument
  | `[${string}...]`

/** Base descriptor for command-line arguments with shared properties */
export interface ArgumentDescriptorBase {
  name: string
  description: string
  required?: boolean
  variadic?: boolean
  choices?: string[]
  defaultValue?: string | string[]
  defaultValueDescription?: string
}

/** Required positional argument descriptor. Usage: `<name>` */
interface RequiredArgumentDescriptor extends ArgumentDescriptorBase {
  variadic?: false
  required: true
  defaultValue?: undefined
  defaultValueDescription?: undefined
}

/** Optional positional argument with string default. Usage: `[name]` */
interface OptionalArgumentDescriptor extends ArgumentDescriptorBase {
  required?: false
  variadic?: false
  defaultValue?: string
  defaultValueDescription?: string
}

/** Required variadic argument accepting variadic values. Usage: `<name...>` */
interface RequiredVariadicArgumentDescriptor extends ArgumentDescriptorBase {
  required: true
  variadic: true
  defaultValue?: undefined
  defaultValueDescription?: undefined
}

/** Optional variadic argument with array default. Usage: `[name...]` */
interface OptionalVariadicArgumentDescriptor extends ArgumentDescriptorBase {
  required?: false
  variadic: true
  defaultValue?: string[]
  defaultValueDescription?: string
}

/** Union type for all argument descriptor variants */
type ArgumentDescriptorStrict =
  | RequiredArgumentDescriptor
  | OptionalArgumentDescriptor
  | RequiredVariadicArgumentDescriptor
  | OptionalVariadicArgumentDescriptor

/** Helper type for extracting argument configuration options */
type ArgOpts<T extends ArgumentDescriptorStrict> = Omit<T, 'name' | 'description' | 'required' | 'variadic'>

/** Base descriptor for command-line options with shared properties */
export interface OptionDescriptorBase extends Omit<ParseArgsOptionDescriptor, 'type'> {
  type?: ParseArgsOptionDescriptor['type']
  flags: string
  short: string
  long: string
  name: string
  argName?: string
  description: string
  required?: boolean
  optional?: boolean
  variadic?: boolean
  negate?: boolean
  defaultValue?: boolean | string | string[]
  defaultValueDescription?: string
  env?: string
  hidden?: boolean
  choices?: string[]
  group?: string
}

/** Boolean flag option. Usage: `-v, --verbose` */
interface BooleanOptionDescriptor extends OptionDescriptorBase {
  type: 'boolean'
  argName?: undefined
  required?: false
  optional: true
  variadic?: false
  negate: boolean
  defaultValue?: boolean
  defaultValueDescription?: string
}

/** Required string option. Usage: `-f, --file <path>` */
interface RequiredOptionDescriptor extends OptionDescriptorBase {
  type: 'string'
  argName: string
  required: true
  optional?: false
  variadic?: false
  negate?: false
  defaultValue?: undefined
  defaultValueDescription?: undefined
}

/** Optional string option with default. Usage: `-o, --output [path]` */
interface OptionalOptionDescriptor extends OptionDescriptorBase {
  type: 'string'
  argName: string
  required?: false
  optional: true
  variadic?: false
  negate?: false
  defaultValue?: string
  defaultValueDescription?: string
}

/** Required option accepting variadic values. Usage: `-i, --include <patterns...>` */
interface RequiredVariadicOptionDescriptor extends OptionDescriptorBase {
  type: 'string'
  argName: string
  required: true
  optional?: false
  variadic: true
  negate?: false
  defaultValue?: undefined
  defaultValueDescription?: undefined
}

/** Optional option accepting variadic values with defaults. Usage: `-e, --exclude [patterns...]` */
interface OptionalVariadicOptionDescriptor extends OptionDescriptorBase {
  type: 'string'
  argName: string
  required?: false
  optional: true
  variadic: true
  negate?: false
  defaultValue?: string[]
  defaultValueDescription?: string
}

/** Union type for all option descriptor variants */
type OptionDescriptorStrict =
  | BooleanOptionDescriptor
  | RequiredOptionDescriptor
  | OptionalOptionDescriptor
  | RequiredVariadicOptionDescriptor
  | OptionalVariadicOptionDescriptor

/** Helper type for extracting option configuration options */
type OptOpts<T extends OptionDescriptorStrict> = Omit<
  T,
  | 'name'
  | 'description'
  | 'required'
  | 'variadic'
  | 'negate'
  | 'optional'
  | 'type'
  | 'argName'
  | 'short'
  | 'long'
  | 'flags'
>

/** Complete command configuration including all properties and substructures */
export interface CommandDescriptor {
  name: string
  version?: string
  aliases: string[]
  summary?: string
  description: string
  hidden?: boolean
  group?: string
  parent: CommandDescriptor | null
  commands: CommandDescriptor[]
  arguments: ArgumentDescriptorBase[]
  options: OptionDescriptorBase[]
  helpConfiguration: Partial<IHelp>
}

export type OptionDescriptor = AllUnionFields<OptionDescriptorStrict>

export type ArgumentDescriptor = AllUnionFields<ArgumentDescriptorStrict>
