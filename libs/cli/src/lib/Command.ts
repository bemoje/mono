import { arrLast } from '@mono/array'
import { setName } from '@mono/fn'
import { objSortKeys } from '@mono/object'
import { strFirstCharToUpperCase } from '@mono/string'
import colors from 'ansi-colors'
import type { CamelCase, SetFieldType, Simplify } from 'type-fest'
import { parseArgs } from 'node:util'
import { Argument } from './Argument'
import { Help } from './Help'
import { findSubcommand } from './helpers/findSubcommand'
import { getCommandAncestors } from './helpers/getCommandAncestors'
import { lazyProp } from '@mono/decorators'
import { Option } from './Option'
import { findOption } from './helpers/findOption'
import type { Arguments, ICommand, Options } from './types'
import type {
  ActionHandler,
  ArgumentOptions,
  ArgumentUsage,
  IBooleanOption,
  InferNewOptions,
  IOptionalArgument,
  IOptionalOption,
  IOptionalVariadicArgument,
  IOptionalVariadicOption,
  IRequiredArgument,
  IRequiredOption,
  IRequiredVariadicArgument,
  IRequiredVariadicOption,
  OptionOptions,
  OptionUsage,
  ParseArgvResult,
  TriggerDefinition,
  TriggerPredicate,
} from './types.internal'
import type { WithRequired } from '@mono/types'

/**
 * A type-safe CLI composer that can parse argv and generate help without execution coupling.
 */
export class Command<A extends Arguments = [], O extends Options = { help?: boolean }> implements ICommand {
  /** Parent command in the hierarchy, undefined for root command */
  parent?: Command<Arguments, Options>
  /** The command name used to invoke it */
  name: string
  /** Semantic version string displayed by --version flag */
  version?: string
  /** Alternative names for invoking this command */
  aliases: string[]
  /** Brief one-line description shown in command lists */
  summary?: string
  /** Full description displayed in help text */
  description: string
  /** Whether to exclude from help listings */
  hidden?: boolean
  /** Category for organizing related commands in help output */
  group?: string
  /** Positional arguments this command accepts */
  arguments: Argument[]
  /** CLI options (flags) this command recognizes */
  options: Option[]
  /** Subcommands registered with this command */
  commands: Command<Arguments, Options>[]

  /** Main action handler executed when command is invoked */
  protected action?: ActionHandler<A, O, Command<A, O>>

  /** Option-driven actions (e.g., --help, --version) executed when their conditions match */
  protected triggers: TriggerDefinition<A, O, Command<A, O>>[] = []

  constructor(name: string, parent?: ICommand) {
    this.name = name
    this.aliases = []
    this.description = ''
    this.arguments = []
    this.options = []
    this.commands = []

    // Make parent non-enumerable to avoid circular references for toJSON compatibility
    Object.defineProperty(this, 'parent', { value: parent, enumerable: false })
  }

  @lazyProp
  get help(): Help {
    this.addHelpOption()
    return new Help(this)
  }

  /** Configure how the help is rendered */
  helpConfiguration(cb?: (help: Help) => void): InferNewOptions<A, O, { help?: boolean }> {
    const help = this.help
    cb?.(help)
    return this.addHelpOption()
  }

  /** Renders formatted help text using provided help definition */
  renderHelp(config: { noColor?: boolean } = {}): string {
    const result = this.help.render()
    return config.noColor ? colors.stripColor(result) : result
  }

  /** Sets the command name */
  setName(name: string): void {
    this.name = name
  }

  /** Sets command aliases, flattening nested arrays */
  setAliases(...aliases: (string | string[])[]): this {
    this.aliases = aliases.flat()
    return this
  }

  /** Adds aliases to existing ones */
  addAliases(...aliases: (string | string[])[]): this {
    this.aliases.push(...aliases.flat())
    return this
  }

  /** Sets the command version */
  setVersion(version: string): InferNewOptions<A, O, { version?: boolean }> {
    this.version = version
    return this.addVersionOption()
  }

  /** Sets the command summary */
  setSummary(summary?: string): this {
    this.summary = summary
    return this
  }

  /** Sets command description, joining variadic lines */
  setDescription(...lines: string[]): this {
    this.description = lines.join('\n')
    return this
  }

  /** Sets whether command is hidden from help */
  setHidden(hidden: boolean | undefined = true): this {
    this.hidden = hidden
    return this
  }

  /** Sets the command group for help organization */
  setGroup(group?: string): this {
    this.group = group
    return this
  }

  /** Add a subcommand and return the subcommand. All options are inherited by the subcommand. */
  command(name: string): Command<[], O>
  /** Add a subcommand and return the subcommand. Only selected options are inherited by the subcommand. */
  command<K extends keyof O>(name: string, options: { inheritOptions: K[] }): Command<[], Pick<O, K>>
  /** Add a subcommand and return the subcommand. All except selected options are inherited by the subcommand. */
  command<K extends keyof O>(name: string, options: { inheritOptionsExcept: K[] }): Command<[], Omit<O, K>>

  command(
    name: string,
    options: {
      inheritOptions?: (keyof O)[]
      inheritOptionsExcept?: (keyof O)[]
    } = {},
  ) {
    const sub = this.createSubcommand(name)
    const inherit = options.inheritOptions
      ? this.options.filter((o) => options.inheritOptions!.includes(o.name as never))
      : options.inheritOptionsExcept
        ? this.options.filter((o) => !options.inheritOptionsExcept!.includes(o.name as never))
        : this.options
    sub.options.push(...inherit)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sub.triggers.push(...(this.triggers.filter((t) => inherit.some((i) => i.name === t.name)) as any[]))
    this.commands.push(sub as never)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return sub as any
  }

  /** Add optional argument with default, eg.: `[name]` */
  addArgument(
    usage: `[${string}]`,
    description: string,
    options: SetFieldType<WithRequired<IOptionalArgument, 'defaultValue'>, 'defaultValue', string>,
  ): Command<[...A, string], O>
  /** Add required variadic argument, eg.: `<name...>` */
  addArgument(
    usage: `<${string}...>`,
    description?: string,
    options?: IRequiredVariadicArgument,
  ): Command<[...A, string[]], O>
  /** Add optional variadic argument with defaults, eg.: `[name...]` */
  addArgument(
    usage: `[${string}...]`,
    description?: string,
    options?: IOptionalVariadicArgument,
  ): Command<[...A, string[]], O>
  /** Add optional argument, eg.: `[name]` */
  addArgument(
    usage: `[${string}]`,
    description?: string,
    options?: SetFieldType<IOptionalArgument, 'defaultValue', undefined | never>,
  ): Command<[...A, string | undefined], O>
  /** Add required argument, eg.: `<name>` */
  addArgument(usage: `<${string}>`, description?: string, options?: IRequiredArgument): Command<[...A, string], O>

  addArgument(usage: ArgumentUsage, description?: string, options?: Partial<ArgumentOptions>) {
    const ins = new Argument(this, usage, description ?? '', options)
    this.arguments.push(ins)
    return this as never
  }

  /** Cast an arguments array */
  castArguments(args: Arguments): A {
    return args as A
  }

  /** Cast an options object */
  castOptions(opts: Options): O {
    return opts as O
  }

  /** Add optional string option, eg.: `-o, --output [path]` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long} [${string}]`,
    description?: string,
    options?: SetFieldType<IOptionalOption, 'defaultValue', undefined | never>,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]?: string } & O>>
  /** Add optional string option with default, eg.: `-o, --output [path]` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long} [${string}]`,
    description: string,
    options: SetFieldType<WithRequired<IOptionalOption, 'defaultValue'>, 'defaultValue', string>,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]: string } & O>>
  /** Add required variadic option, eg.: `-i, --include <patterns...>` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long} <${string}...>`,
    description?: string,
    options?: IRequiredVariadicOption,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]: string[] } & O>>
  /** Add optional variadic option with defaults, eg.: `-e, --exclude [patterns...]` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long} [${string}...]`,
    description?: string,
    options?: IOptionalVariadicOption,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]: string[] } & O>>
  /** Add optional string option, eg.: `-o, --output [path]` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long} [${string}]`,
    description?: string,
    options?: SetFieldType<IOptionalOption, 'defaultValue', undefined | never>,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]?: string } & O>>
  /** Add required string option, eg.: `-f, --file <path>` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long} <${string}>`,
    description?: string,
    options?: IRequiredOption,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]: string } & O>>
  /** Add boolean flag option with default, eg.: `-v, --verbose` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long}`,
    description: string,
    options: SetFieldType<WithRequired<IBooleanOption, 'defaultValue'>, 'defaultValue', boolean>,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]: boolean } & O>>
  /** Add boolean flag option, eg.: `-v, --verbose` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long}`,
    description?: string,
    options?: SetFieldType<IBooleanOption, 'defaultValue', undefined | never>,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]?: boolean } & O>>

  /**
   * Adds command-line option with type inference. Parses format: `-s, --long [<value>|[value]|<value...>|[value...]]`
   */
  addOption<Long extends string>(flags: OptionUsage<Long>, description?: string, opts?: Partial<OptionOptions>) {
    const ins = new Option<Long>(this, flags, description, opts)
    this.options.push(ins)
    return this as never
  }

  /** Parses command-line arguments with subcommand support and type-safe validation. */
  parseArgv(argv: string[] = process.argv.slice(2)): ParseArgvResult<Arguments, Options & O, Command<A, O>> {
    // navigate to subcommand if found
    const sub = findSubcommand(this, argv[0])
    if (sub) {
      // recurse into subcommand
      return sub.parseArgv(argv.slice(1)) as unknown as ParseArgvResult<Arguments, Options & O, Command<A, O>>
    }

    // Map long option names to their camelCased names
    this.options.forEach((o) => {
      if (o.long === o.name) return
      argv = argv.map((a) => {
        if (a === `--${o.long}`) return `--${o.name}`
        if (a === `--no-${o.long}`) return `--no-${o.name}`
        return a
      })
    })

    // parse
    const parsed = parseArgs({
      args: argv,
      options: Object.fromEntries(
        this.options.map((o) => [
          o.name,
          {
            type: o.type,
            short: o.short,
            default: o.defaultValue,
            multiple: !!o.variadic,
          },
        ]),
      ),
      allowPositionals: true,
      tokens: true,
      strict: false,
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

    // Merge default option values with parsed options
    for (const option of this.options) {
      Reflect.set(parsed.values, option.name, parsed.values[option.name] ?? option.defaultValue)
    }

    // sort options by value: defined -> true -> false -> undefined
    parsed.values = objSortKeys(parsed.values, (a, b) => {
      return a[1] === undefined
        ? 1
        : a[1] === false
          ? 1
          : b[1] === false
            ? -1
            : a[1] === true
              ? 1
              : b[1] === true
                ? -1
                : 0
    })

    // Handle positional arguments
    const parsedArguments = this.arguments.map((arg, index) => {
      if (arg.variadic) {
        // Variadic argument gets all remaining positionals
        const remainingArgs = parsed.positionals.slice(index)
        return remainingArgs.length > 0 ? remainingArgs : arg.defaultValue
      } else {
        // Regular argument gets positional at index or default
        return parsed.positionals[index] ?? arg.defaultValue
      }
    })

    // Trim trailing undefined values, but wihout affecting arg indices
    while (parsedArguments.length && arrLast(parsedArguments) === undefined) {
      parsedArguments.pop()
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const cmd = this
    const path = getCommandAncestors(cmd).map((c) => c.name)
    const args = parsedArguments as A
    const opts = parsed.values as unknown as O
    const triggers = this.triggers.filter((t) => t.predicate({ args, opts, cmd }))
    const action = triggers[0]?.action ?? this.action
    const execute = action ? setName(action.name, () => action({ args, opts, triggers, cmd })) : undefined

    return {
      get cmd() {
        return cmd
      },
      ...{ path, argv, args, opts, triggers },
      ...{ action: action?.name, execute },
    } as unknown as ParseArgvResult<Arguments, Options & O, Command<A, Options & O>>
  }

  setAction(fn: ActionHandler<A, O, Command<A, O>>): this {
    this.action = setName('main', fn as never)
    return this
  }

  /**
   * Register an action to be invoked when a boolean option is set to true.
   *
   * Triggers execute in addition to or instead of the main action handler,
   * allowing for option-driven behavior. For example, `--help` and `--version`
   * are implemented as triggers.
   *
   * @param name - The option name (must be a boolean option)
   * @param action - Handler called when the option evaluates to true
   * @returns This command instance for chaining
   *
   * @example
   * ```
   * cmd.addOption('-v, --verbose', 'Enable verbose output')
   *    .addTrigger('verbose', ({ args, opts }) => {
   *      console.log('Verbose mode enabled', { args, opts })
   *    })
   * ```
   */
  addTrigger<C extends ICommand = Command<A, O>>(name: keyof O, action: ActionHandler<A, O, C>): this {
    this.triggers.push({
      name,
      predicate: setName('has' + strFirstCharToUpperCase(name as string), (({ opts }) => {
        return typeof opts[name] === 'boolean' && opts[name] === true
      }) as TriggerPredicate<A, O, Command<A, O>>),
      action: setName(name as string, action),
    } as never)
    return this
  }

  /** Adds `-h, --help` option with a trigger that prints help text */
  protected addHelpOption(): InferNewOptions<A, O, { help?: boolean }> {
    if (findOption(this, 'help')) return this
    return this.addOption('-h, --help', 'Display help information') //
      .addTrigger('help', ({ cmd }) => {
        console.log(cmd.renderHelp())
      }) as InferNewOptions<A, O, { help?: boolean }>
  }

  /** Adds `-V, --version` option with a trigger that prints version */
  protected addVersionOption(): InferNewOptions<A, O, { version?: boolean }> {
    if (findOption(this, 'version')) return this
    return this.addOption('-V, --version', 'Display semver version') //
      .addTrigger('version', ({ cmd }) => {
        console.log(cmd.version)
      }) as InferNewOptions<A, O, { version?: boolean }>
  }

  /** Returns a new Command instance. Override this method in subclasses. */
  protected createSubcommand(name: string): Command<[], O> {
    return new Command<[], O>(name, this)
  }
}
