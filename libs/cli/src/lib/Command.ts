/* eslint-disable @typescript-eslint/ban-types */
import { arrLast, arrRemoveDuplicates } from '@mono/array'
import { setName } from '@mono/fn'
import { entriesOf, objSortKeys, valuesOf } from '@mono/object'
import { strFirstCharToUpperCase } from '@mono/string'
import colors from 'ansi-colors'
import type { CamelCase, SetFieldType, Simplify, SetRequired } from 'type-fest'
import { inspect, parseArgs } from 'node:util'
import { Help } from './Help'
import { findCommand } from './helpers/findCommand'
import { getCommandAncestors } from './helpers/getCommandAncestors'
import { lazyProp } from '@mono/decorators'
import { findOption } from './helpers/findOption'
import type { Arguments, Argument, ICommand, Option, Options, SubCommands } from './types'
import type {
  ActionHandler,
  ArgumentOptions,
  ArgumentUsage,
  BooleanOptionOptions,
  AllowedArgumentUsage,
  InferAddedArgumentType,
  InferAddOptionResult,
  OptionalArgumentOptions,
  OptionalArgumentOptionsWithDefaultValue,
  OptionalOptionOptions,
  OptionalVariadicArgumentOptions,
  OptionalVariadicOptionOptions,
  RequiredArgumentOptions,
  RequiredOptionOptions,
  RequiredVariadicArgumentOptions,
  RequiredVariadicOptionOptions,
  OptionOptions,
  OptionUsage,
  ParseArgvResult,
  HookDefinition,
  HookPredicate,
} from './types.internal'
import { parseOptionFlags } from './helpers/parseOptionFlags'
import { kebabCase } from 'es-toolkit/string'
import { getCommandAndAncestors } from './helpers/getCommandAndAncestors'

/**
 * A type-safe CLI composer that can parse argv and generate help without execution coupling.
 */
export class Command<
  A extends Arguments = [],
  O extends Options = { help?: boolean; debug?: boolean },
  Subs extends SubCommands = {},
> implements ICommand
{
  /** Parent command in the hierarchy, undefined for root command */
  parent?: Command<Arguments, Options, SubCommands>
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
  commands: Subs
  /** Main action handler executed when command is invoked */
  protected action: ActionHandler<A, O, Subs>
  /** Option-driven actions (e.g., --help, --version) executed when their conditions match */
  protected hooks: HookDefinition<A, O, Subs>[]

  constructor(name: string, parent?: ICommand) {
    this.name = name
    this.aliases = []
    this.description = ''
    this.arguments = []
    this.options = []
    this.commands = {} as Subs
    this.action = setName('help', ({ cmd }) => console.log(cmd.renderHelp()))
    this.hooks = []

    // Make parent non-enumerable to avoid circular references for toJSON compatibility
    Object.defineProperty(this, 'parent', { value: parent, enumerable: false })

    if (!parent) {
      this.addOption('-D, --debug', { description: 'Display debug information' }) //
        .addHook('debug', ({ cmd, ...data }) => {
          console.debug(inspect(cmd, { depth: 1, colors: true }))
          console.debug(inspect(data, { depth: 3, colors: true }))
        })

      this.addOption('-h, --help', { description: 'Display help information' }) //
        .addHook('help', ({ cmd }) => {
          console.log(cmd.renderHelp())
          process.exit(0)
        })
    }
  }

  @lazyProp
  protected get help(): Help {
    return new Help(this)
  }

  /** Configure how the help is rendered */
  helpConfiguration(cb?: (help: Help) => void): this {
    const help = this.help
    cb?.(help)
    return this
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
    this.aliases = []
    this.addAliases(...aliases)
    return this
  }

  /** Adds aliases to existing ones */
  addAliases(...aliases: (string | string[])[]): this {
    const taken = this.parent ? valuesOf(this.parent.commands).flatMap((c) => [c.name, ...c.aliases]) : []
    arrRemoveDuplicates(aliases.flat())
      .filter((a) => !this.aliases.includes(a) && a !== this.name)
      .forEach((a) => {
        if (taken.includes(a)) {
          throw new Error(
            `Alias "${a}" is already used by a sibling command: ${findCommand(this.parent!, a)?.name}`,
          )
        }
        this.aliases.push(a)
      })
    this.aliases.sort((a, b) => a.length - b.length)
    return this
  }

  /** Sets the command version */
  setVersion(version: string): InferAddOptionResult<A, O, { version?: boolean }, Subs> {
    this.version = version
    if (findOption(this, 'version')) return this
    return this.addOption('-V, --version', { description: 'Display semver version' }) //
      .addHook('version', ({ cmd }) => {
        const version = getCommandAndAncestors(cmd).find((c) => c.version)?.version
        if (version) {
          console.log(version)
          process.exit(0)
        }
      })
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  command<Name extends string, Sub extends Command<any, any, any> = Command<[], O, {}>>(
    name: Name,
    cb?: (cmd: Command<[], O>, parent: this) => Sub,
  ): Sub {
    const sub = this.createSubcommand(name)
    const inherit = this.options
    sub.options.push(...inherit)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inheritHooks = this.hooks.filter((t) => inherit.some((i) => i.name === t.name)) as any[]
    sub.hooks.push(...inheritHooks)

    const taken = valuesOf(this.commands).flatMap((c) => [c.name, ...c.aliases])
    if (taken.includes(name)) {
      throw new Error(
        `Command name "${getCommandAndAncestors(sub).map((c) => c.name)}" is already used by this command or its aliases: ${taken.join(', ')}`,
      )
    }
    const kebab = kebabCase(name)
    const words = kebab.split('-')
    const initials = words.map((s) => s[0]).join('')
    if (!taken.includes(initials)) {
      sub.addAliases(initials)
    } else {
      const initials = words.map((s) => s[0] + s[1]).join('')
      if (!taken.includes(initials)) {
        sub.addAliases(initials)
      }
    }

    this.commands[name] = sub as never

    return (cb ? cb(sub, this) : sub) as never
  }

  /** Add a subcommand and return the subcommand. All options are inherited by the subcommand. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCommand<Name extends string, Sub extends Command<any, any, any> = Command<[], O, {}>>(
    name: Name,
    cb: (cmd: Command<[], O, {}>, parent: this) => Sub,
  ): Command<A, O, Subs & { [K in Name]: Sub }> {
    this.command(name, cb)
    return this as never
  }

  /** Add required variadic argument, eg.: `<name...>` */
  addArgument<const Opts extends RequiredVariadicArgumentOptions>(
    usage: AllowedArgumentUsage<this, `<${string}...>`>,
    options?: Opts,
  ): Command<[...A, InferAddedArgumentType<Opts>[]], O, Subs>

  /** Add required argument, eg.: `<name>` */
  addArgument<const Opts extends RequiredArgumentOptions>(
    usage: AllowedArgumentUsage<this, `<${string}>`>,
    options?: Opts,
  ): Command<[...A, InferAddedArgumentType<Opts>], O, Subs>

  /** Add optional variadic argument with defaults, eg.: `[name...]` */
  addArgument<const Opts extends OptionalVariadicArgumentOptions>(
    usage: AllowedArgumentUsage<this, `[${string}...]`>,
    options?: Opts,
  ): Command<[...A, InferAddedArgumentType<Opts>[]], O, Subs>

  /** Add optional argument with default, eg.: `[name]` */
  addArgument<const Opts extends OptionalArgumentOptionsWithDefaultValue>(
    usage: AllowedArgumentUsage<this, `[${string}]`>,
    options: Opts,
  ): Command<[...A, InferAddedArgumentType<Opts>], O, Subs>

  /** Add optional argument, eg.: `[name]` */
  addArgument<const Opts extends OptionalArgumentOptions>(
    usage: AllowedArgumentUsage<this, `[${string}]`>,
    options?: Opts,
  ): Command<[...A, InferAddedArgumentType<Opts> | undefined], O, Subs>

  // Implementation
  addArgument(usage: ArgumentUsage, options: ArgumentOptions = {}) {
    if (!/^<(.*?)>$|^\[(.*?)\]$/.test(usage)) {
      throw new Error(`Invalid argument format: ${usage}`)
    }

    const name = usage.slice(1, -1).replace(/\.\.\.$/, '')
    const required = usage.startsWith('<')
    const variadic = usage.slice(0, -1).endsWith('...')

    const prevArg = this.arguments[this.arguments.length - 1]

    if (prevArg?.variadic) {
      throw new Error(`Cannot add argument ${usage} after variadic argument ${prevArg.usage}`)
    }

    if (required && prevArg && !prevArg?.required) {
      throw new Error(`Cannot add required argument ${usage} after optional argument ${prevArg?.usage || 'none'}`)
    }

    if (required && prevArg?.defaultValue) {
      throw new Error(
        `Cannot add required argument ${usage} after optional argument with default value ${prevArg.usage}`,
      )
    }

    const arg: Argument = {
      usage,
      name,
      required,
      variadic,
      ...options,
    }

    if (variadic && !arg.defaultValue) {
      arg.defaultValue = [] as string[]
    }

    this.arguments.push(arg)
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
    options?: SetFieldType<OptionalOptionOptions, 'defaultValue', undefined | never>,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]?: string } & O>, Subs>
  /** Add optional string option with default, eg.: `-o, --output [path]` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long} [${string}]`,
    options: SetFieldType<SetRequired<OptionalOptionOptions, 'defaultValue'>, 'defaultValue', string>,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]: string } & O>, Subs>
  /** Add required variadic option, eg.: `-i, --include <patterns...>` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long} <${string}...>`,
    options?: RequiredVariadicOptionOptions,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]: string[] } & O>, Subs>
  /** Add optional variadic option with defaults, eg.: `-e, --exclude [patterns...]` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long} [${string}...]`,
    options?: OptionalVariadicOptionOptions,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]: string[] } & O>, Subs>
  /** Add required string option, eg.: `-f, --file <path>` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long} <${string}>`,
    options?: RequiredOptionOptions,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]: string } & O>, Subs>
  /** Add boolean flag option with default, eg.: `-v, --verbose` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long}`,
    options: SetFieldType<SetRequired<BooleanOptionOptions, 'defaultValue'>, 'defaultValue', boolean>,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]: boolean } & O>, Subs>
  /** Add boolean flag option, eg.: `-v, --verbose` */
  addOption<Long extends string>(
    flags: `-${string}, --${Long}`,
    options?: SetFieldType<BooleanOptionOptions, 'defaultValue', undefined | never>,
  ): Command<A, Simplify<{ [K in CamelCase<Long>]?: boolean } & O>, Subs>

  /**
   * Adds command-line option with type inference. Parses format: `-s, --long [<value>|[value]|<value...>|[value...]]`
   */
  addOption<Long extends string>(flags: OptionUsage<Long>, opts: Partial<OptionOptions> = {}) {
    const ins = {} as Option

    const { short, long, name, argName } = parseOptionFlags<Long>(flags)

    for (const opt of this.options) {
      if (opt.long === long) {
        throw new Error(`Option long name, --${long} already in use by: ${opt.flags}`)
      }
      if (opt.short === short) {
        throw new Error(`Option short name, -${short} already in use by: ${opt.flags}`)
      }
    }

    ins.flags = flags
    ins.short = short
    ins.long = long
    ins.name = name
    ins.description = ''
    if (!argName) {
      ins.type = 'boolean'
    } else {
      ins.type = 'string'
      ins.argName = argName
      if (flags.endsWith('>')) {
        if (flags.endsWith('...>')) {
          ins.required = true
          ins.variadic = true
        } else {
          ins.required = true
        }
      } else if (flags.endsWith(']')) {
        if (flags.endsWith('...]')) {
          ins.variadic = true
          ins.defaultValue = (opts.defaultValue ?? []) as string[]
        }
      }
    }

    // Assign options
    for (const [key, value] of Object.entries(opts)) {
      if (value !== undefined) Reflect.set(ins, key, value)
    }

    // If defined, set environment variable as defaultValue
    if (ins.env && ins.defaultValue === undefined && typeof process.env[ins.env] === 'string') {
      if (ins.type === 'boolean') {
        ins.defaultValue = /^(t(rue)?|y(es)?|1)$/i.test(process.env[ins.env]!)
      } else if (ins.variadic) {
        ins.defaultValue = process.env[ins.env]!.replace(/\]|\[/, '')
          .split(',')
          .map((v) => v.trim())
      } else {
        ins.defaultValue = process.env[ins.env]!
      }
    }

    this.options.push(ins)
    return this as never
  }

  /** Parses command-line arguments with subcommand support and type-safe validation. */
  parseArgv(argv: string[] = process.argv.slice(2)): ParseArgvResult<Arguments, Options & O, SubCommands> {
    // navigate to subcommand if found
    const sub = findCommand(this, argv[0])
    if (sub) {
      // recurse into subcommand
      return sub.parseArgv(argv.slice(1)) as unknown as ParseArgvResult<Arguments, Options & O, SubCommands>
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

    // validation
    const errors = parsedArguments
      .map((arg, index) => {
        const argDef = this.arguments[index]
        if (argDef.required) {
          if (argDef.variadic ? Array.isArray(arg) && arg.length === 0 : arg === undefined) {
            return `Missing required argument [${index}]: ${argDef.usage}`
          }
        }
        const choices = argDef.choices
        if (choices) {
          const values = [arg].flat()
          if (!values.every((v) => choices.includes(v as string))) {
            return `Invalid value for argument [${index}] ${argDef.usage}: ${arg}. Allowed values are: ${choices.join(', ')}`
          }
        }
        return ''
      })
      .concat(
        entriesOf(parsed.values).map(([key, value]) => {
          const optionDef = this.options.find((o) => o.name === key)!
          if (!optionDef) {
            return `Unknown option --${key}`
          }
          if (optionDef.argName && optionDef.required && value === undefined) {
            return `Required option value ${optionDef.flags} is undefined`
          }
          if (value !== undefined && optionDef.choices) {
            const values = (optionDef.variadic ? value : [value]) as string[]
            if (!values.every((v) => optionDef.choices!.includes(v))) {
              return `Invalid value for option ${optionDef.flags}: ${value}. Allowed values are: ${optionDef.choices.join(', ')}`
            }
          }
          return ''
        }),
      )
      .filter(Boolean)
      .reduce(
        (acc, curr) => {
          return (acc ?? []).concat(curr)
        },
        undefined as string[] | undefined,
      )

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const cmd = this
    const path = getCommandAncestors(cmd).map((c) => c.name)
    const args = parsedArguments as A
    const opts = parsed.values as unknown as O
    const action = this.action
    const hooks = this.hooks.filter((t) =>
      t.predicate({ path, argv, args, opts, errors, action: action.name, cmd }),
    )
    const execute = setName(action.name, async () => {
      for (const hook of hooks) {
        await hook.action({ cmd, path, argv, args, opts, errors })
      }
      if (errors) {
        errors.forEach((e) => console.error(colors.red(`Error: ${e}`)))
        console.error(`Use --help for usage information.`)
        process.exit(1)
      }
      return action({ path, argv, args, opts, cmd })
    })

    return {
      get cmd() {
        return cmd
      },
      ...{ path, argv, args, opts, errors, hooks },
      ...{ action: action.name, execute },
    } as unknown as ParseArgvResult<Arguments, Options & O, Subs>
  }

  setAction(fn: ActionHandler<A, O, Subs>): this {
    this.action = setName(fn.name || 'main', fn as never)
    return this
  }

  /**
   * Register an action to be invoked when a boolean option is set to true.
   *
   * Hooks execute in addition to or instead of the main action handler,
   * allowing for option-driven behavior. For example, `--help` and `--version`
   * are implemented as hooks.
   *
   * @param name - The option name (must be a boolean option)
   * @param action - Handler called when the option evaluates to true
   * @returns This command instance for chaining
   */
  addHook(name: keyof O, action: ActionHandler<A, O, Subs>): this {
    this.hooks.push({
      name,
      predicate: setName('has' + strFirstCharToUpperCase(name as string), (({ opts }) => {
        return typeof opts[name] === 'boolean' && opts[name] === true
      }) as HookPredicate<A, O, Subs>),
      action: setName(name as string, action),
    } as never)
    return this
  }

  /** Returns a new Command instance. Override this method in subclasses. */
  protected createSubcommand(name: string): Command<[], O> {
    return new Command<[], O>(name, this)
  }
}
