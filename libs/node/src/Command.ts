import { parseArgs, ParseArgsOptionDescriptor } from 'node:util'
import {
  type ArgumentHelp,
  type CommandHelp,
  type ICommandHelpDefinition,
  type OptionHelp,
} from './CommandHelpDefinition'

type BooleanOptionUsage = `-${string}, --${string}`
type RequiredOptionUsage = `-${string}, --${string} <${string}>`
type OptionalOptionUsage = `-${string}, --${string} [${string}]`
type RequiredVariadicOptionUsage = `-${string}, --${string} <${string}...>`
type OptionalVariadicOptionUsage = `-${string}, --${string} [${string}...]`

type OptionUsage =
  | BooleanOptionUsage
  | RequiredOptionUsage
  | OptionalOptionUsage
  | RequiredVariadicOptionUsage
  | OptionalVariadicOptionUsage

type RequiredArgumentUsage = `<${string}>`
type OptionalArgumentUsage = `[${string}]`
type RequiredVariadicArgumentUsage = `<${string}...>`
type OptionalVariadicArgumentUsage = `[${string}...]`

type ArgumentUsage =
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

interface CommandDescriptor {
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
  helpConfiguration: Partial<ICommandHelpDefinition>
}

/** Union type for all argument descriptor variants */
type ArgumentDescriptor =
  | RequiredArgumentDescriptor
  | OptionalArgumentDescriptor
  | RequiredVariadicArgumentDescriptor
  | OptionalVariadicArgumentDescriptor

/** Union type for all option descriptor variants */
type OptionDescriptor =
  | BooleanOptionDescriptor
  | RequiredOptionDescriptor
  | OptionalOptionDescriptor
  | RequiredVariadicOptionDescriptor
  | OptionalVariadicOptionDescriptor

type ArgOpts<T extends ArgumentDescriptor> = Omit<T, 'name' | 'description' | 'required' | 'multiple'>
type OptOpts<T extends OptionDescriptor> = Omit<
  T,
  'name' | 'description' | 'required' | 'multiple' | 'type' | 'argName' | 'short' | 'long'
>

export type CommandTypes = {
  ArgumentDescriptorBase: ArgumentDescriptorBase
  RequiredArgumentDescriptor: RequiredArgumentDescriptor
  OptionalArgumentDescriptor: OptionalArgumentDescriptor
  RequiredVariadicArgumentDescriptor: RequiredVariadicArgumentDescriptor
  OptionalVariadicArgumentDescriptor: OptionalVariadicArgumentDescriptor
  OptionalDescriptorBase: OptionDescriptorBase
  BooleanOptionDescriptor: BooleanOptionDescriptor
  RequiredOptionDescriptor: RequiredOptionDescriptor
  OptionalOptionDescriptor: OptionalOptionDescriptor
  RequiredVariadicOptionDescriptor: RequiredVariadicOptionDescriptor
  OptionalVariadicOptionDescriptor: OptionalVariadicOptionDescriptor
  ArgumentDescriptor: ArgumentDescriptor
  OptionDescriptor: OptionDescriptor
}

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
  state: CommandDescriptor

  constructor(name: string, parent: Command | null = null) {
    this.state = {
      name,
      parent,
      aliases: [],
      description: '',
      commands: [],
      arguments: [],
      options: [],
      helpConfiguration: { showGlobalOptions: true, sortOptions: true, sortSubcommands: true },
    }
    Object.defineProperty(this.state, 'parent', { enumerable: false })
  }

  get name() {
    return this.state.name
  }
  get version() {
    return this.state.version
  }
  get aliases() {
    return this.state.aliases
  }
  get summary() {
    return this.state.summary
  }
  get description() {
    return this.state.description
  }
  get hidden() {
    return this.state.hidden
  }
  get group() {
    return this.state.group
  }
  get parent() {
    return this.state.parent
  }
  get commands() {
    return this.state.commands
  }
  get arguments() {
    return this.state.arguments
  }
  get options() {
    return this.state.options
  }
  get helpConfiguration() {
    return this.state.helpConfiguration
  }

  toJSON() {
    return this.state
  }

  setName(name: string) {
    this.state.name = name
  }

  setAliases(...aliases: (string | string[])[]) {
    this.state.aliases = aliases.flat()
    return this
  }

  setVersion(version?: string) {
    this.state.version = version
    return this
  }

  setSummary(summary?: string) {
    this.state.summary = summary
    return this
  }

  setDescription(...lines: string[]) {
    this.state.description = lines.join('\n')
    return this
  }

  setHidden(hidden: boolean | undefined = true) {
    this.state.hidden = hidden
    return this
  }

  setGroup(group?: Exclude<string, 'Options' | 'Global Options'>) {
    this.state.group = group
    return this
  }

  setParent(parent: Command | null) {
    this.state.parent = parent
    return this
  }

  setHelpConfiguration(config: Partial<ICommandHelpDefinition>) {
    this.state.helpConfiguration = { ...this.helpConfiguration, ...config }
    return this
  }

  /** Creates and adds a subcommand */
  command(name: string): Command {
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
    } else {
      throw new Error(`Invalid argument format: ${usage}`)
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
    } else {
      throw new Error(`Invalid option format: ${usage}`)
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
      allowNegative: false,
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
      allowNegative: false,
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
    return this.options.find((option) => this.optionsIs(option, arg))
  }

  /** Checks if option matches name or short name */
  protected optionsIs(option: OptionDescriptor, nameOrShortName: string) {
    return option.short === nameOrShortName || option.name === nameOrShortName
  }

  /** Renders formatted help text using provided help definition */
  renderHelp(help: ICommandHelpDefinition): string {
    const helper = Object.assign(help, this.helpConfiguration ?? {})
    return helper.formatHelp(commandHelp(this), helper)

    function commandHelp(cmd: Command, parentHelp?: CommandHelp): CommandHelp {
      let cmds: CommandHelp[] | undefined = undefined
      return {
        name: cmd.name,
        aliases: cmd.aliases,
        summary: cmd.summary ?? (cmd.description.includes('\n') ? cmd.description.split('\n')[0] : undefined),
        description: cmd.description,
        hidden: cmd.hidden,
        usage: renderCommandUsage(cmd),
        group: cmd.group,
        get commands() {
          if (cmds) return cmds
          cmds = cmd.commands.map((c) => commandHelp(c, this))
          return cmds
        },
        options: cmd.options.map(optionHelp),
        arguments: cmd.arguments.map(argumentHelp),
        parent: cmd.parent ? commandHelp(cmd.parent) : (parentHelp ?? null),
        helpConfiguration: cmd.helpConfiguration,
      }
    }

    function argumentHelp(arg: ArgumentDescriptor): ArgumentDescriptorBase & ArgumentHelp {
      return {
        ...arg,
        name: arg.name,
        description: arg.description,
        required: arg.required,
        variadic: arg.multiple,
        defaultValue: arg.defaultValue,
        defaultValueDescription: arg.defaultValueDescription,
        choices: arg.choices,
      }
    }

    function optionHelp(opt: OptionDescriptor): OptionDescriptorBase & OptionHelp {
      return {
        ...opt,
        flags: renderOptionUsage(opt),
        description: opt.description,
        required: opt.required,
        optional: !opt.required,
        variadic: opt.multiple,
        short: opt.short,
        long: opt.name,
        negate: false,
        defaultValue: opt.defaultValue,
        defaultValueDescription: opt.defaultValueDescription,
        env: opt.env,
        hidden: opt.hidden,
        choices: opt.choices,
        group: opt.group,
      }
    }

    function renderArgumentUsage(arg: ArgumentDescriptor): ArgumentUsage {
      return (
        arg.required
          ? arg.multiple
            ? `<${arg.name}...>`
            : `<${arg.name}>`
          : arg.multiple
            ? `[${arg.name}...]`
            : `[${arg.name}]`
      ) as ArgumentUsage
    }

    function renderOptionUsage(opt: OptionDescriptor): OptionUsage {
      const usage = `-${opt.short}, --${opt.name}`
      return opt.type === 'boolean'
        ? (usage as BooleanOptionUsage)
        : opt.required
          ? opt.multiple
            ? ((usage + ` <${opt.argName}...>`) as RequiredVariadicOptionUsage)
            : ((usage + ` <${opt.argName}>`) as RequiredOptionUsage)
          : opt.multiple
            ? ((usage + ` [${opt.argName}...]`) as OptionalVariadicOptionUsage)
            : ((usage + ` [${opt.argName}]`) as OptionalOptionUsage)
    }

    function renderCommandUsage(cmd: Command): string {
      return [
        ...(cmd.options.length ? ['[options]'] : []),
        ...(cmd.commands.length ? ['[command]'] : []),
        ...cmd.arguments.map((arg) => renderArgumentUsage(arg)),
      ].join(' ')
    }
  }
}
