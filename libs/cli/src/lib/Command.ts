/* eslint-disable @typescript-eslint/ban-types */
import { arrRemoveDuplicates } from '@mono/array'
import { setName } from '@mono/fn'
import { filterObject } from '@mono/object'
import { objSortKeys } from '@mono/object'
import { valuesOf } from '@mono/object'
import { collectVariadicOptionValues } from './internal/collectVariadicOptionValues'
import { mergeOptionDefaults } from './internal/mergeOptionDefaults'
import { normalizeArgv } from './internal/normalizeArgv'
import { resolveArguments } from './internal/resolveArguments'
import { validateParsed } from './internal/validateParsed'
import { strFirstCharToUpperCase } from '@mono/string'
import colors from 'ansi-colors'
import type { CamelCase } from 'type-fest'
import type { SetFieldType } from 'type-fest'
import type { Simplify } from 'type-fest'
import type { SetRequired } from 'type-fest'
import { inspect } from 'node:util'
import { parseArgs } from 'node:util'
import { Help } from './Help'
import { findCommand } from './helpers/findCommand'
import { getCommandAncestors } from './helpers/getCommandAncestors'
import { lazyProp } from '@mono/decorators'
import { timer } from '@mono/node'
import { findOption } from './helpers/findOption'
import type { Arguments } from './types'
import type { Argument } from './types'
import type { ICommand } from './types'
import type { Option } from './types'
import type { Options } from './types'
import type { SubCommands } from './types'
import type { ActionHandler } from './types'
import type { ArgumentOptions } from './types'
import type { ArgumentUsage } from './types'
import type { BooleanOptionOptions } from './types'
import type { AllowedArgumentUsage } from './types'
import type { InferAddedArgumentType } from './types'
import type { InferAddOptionResult } from './types'
import type { OptionalArgumentOptions } from './types'
import type { OptionalArgumentOptionsWithDefaultValue } from './types'
import type { OptionalOptionOptions } from './types'
import type { OptionalVariadicArgumentOptions } from './types'
import type { OptionalVariadicOptionOptions } from './types'
import type { RequiredArgumentOptions } from './types'
import type { RequiredOptionOptions } from './types'
import type { RequiredVariadicArgumentOptions } from './types'
import type { RequiredVariadicOptionOptions } from './types'
import type { OptionOptions } from './types'
import type { OptionUsage } from './types'
import type { ParseArgvResult } from './types'
import type { HookDefinition } from './types'
import type { HookActionHandler } from './types'
import type { HookPredicate } from './types'
import { parseOptionFlags } from './helpers/parseOptionFlags'
import { kebabCase } from 'es-toolkit/string'
import { getCommandAndAncestors } from './helpers/getCommandAndAncestors'

/**
 * A type-safe CLI composer that can parse argv and generate help without execution coupling.
 */
export class Command<
  A extends Arguments = [],
  O extends Options = { help?: boolean; debug?: boolean },
  Subs extends SubCommands = SubCommands,
> implements ICommand
{
  /** Parent command in the hierarchy, undefined for root command */
  parent?: Command<Arguments, Options & O>
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
  protected action?: ActionHandler<A, O, Subs>
  /** Option-driven actions (e.g., --help, --version) executed when their conditions match */
  protected hooks: HookDefinition<Arguments, Options & O>[]

  constructor(name: string, parent?: ICommand) {
    this.name = name
    this.aliases = []
    this.description = ''
    this.arguments = []
    this.options = []
    this.commands = {} as Subs
    this.hooks = []

    // Make parent non-enumerable to avoid circular references for toJSON compatibility
    Object.defineProperty(this, 'parent', { value: parent, enumerable: false })

    if (!parent) {
      this.addOption('-D, --debug', { description: 'Display debug information' }) //
        .addOptionHook('debug', ({ cmd, ...data }) => {
          console.debug(inspect(cmd, { depth: 1, colors: true }))
          console.debug(inspect(data, { depth: 3, colors: true }))
        })

      this.addOption('-h, --help', { description: 'Display help information' }) //
        .addOptionHook('help', ({ cmd }) => {
          console.log(cmd.renderHelp())
          process.exitCode = 0
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
      .addOptionHook('version', ({ cmd }) => {
        console.log(getCommandAndAncestors(cmd).find((c) => c.version)?.version)
        process.exitCode = 0
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
    cb?: (cmd: Command<[], O, {}>, parent: this) => Sub,
  ): Sub {
    if (this.arguments.length) {
      throw new Error(
        `Cannot add subcommand "${name}" to "${this.name}" because it already has arguments defined.`,
      )
    }
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
  ): Command<A, O, (SubCommands extends Subs ? {} : Subs) & { [K in Name]: Sub }> {
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
      throw new Error(`Cannot add required argument ${usage} after optional argument ${prevArg?.usage}`)
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
      ins.required = false
      ins.flags = ins.flags.replace('<', '[').replace('>', ']')
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

  /**
   * Register an action to be invoked when an option is set to true or string value.
   *
   * Hooks execute in addition to or instead of the main action handler,
   * allowing for option-driven behavior. For example, `--help` and `--version`
   * are implemented as hooks.
   */
  addOptionHook(optionName: keyof O, action: HookActionHandler<Arguments, O>): this {
    const def = findOption(this, optionName as string)!
    if (!def.group && /process\.exitCode ?= ?.+;?\s*\}$/.test(action.toString())) {
      def.group = 'Command Options'
    }
    this.hooks.push({
      name: optionName,
      predicate: setName('has' + strFirstCharToUpperCase(optionName as string), (({ opts }) => {
        return (
          opts[optionName] !== undefined &&
          opts[optionName] !== false &&
          !(Array.isArray(opts[optionName]) && opts[optionName].length === 0)
        )
      }) as HookPredicate<Arguments, Options & O>),
      action: setName(optionName as string, action),
    } as never)
    return this
  }

  /** Parses command-line arguments with subcommand support and type-safe validation. */
  parseArgv(argv: string[] = process.argv.slice(2)): ParseArgvResult<Arguments, Options & O> {
    const sub = findCommand(this, argv[0])
    if (sub) return sub.parseArgv(argv.slice(1)) as unknown as ParseArgvResult<Arguments, Options & O>

    argv = normalizeArgv(argv, this.options)

    const parsed = parseArgs({
      args: argv,
      options: Object.fromEntries(
        this.options.map((o) => [
          o.name,
          { type: o.type, short: o.short, default: o.defaultValue, multiple: !!o.variadic },
        ]),
      ),
      allowPositionals: true,
      tokens: true,
      strict: false,
      allowNegative: true,
    })

    collectVariadicOptionValues(parsed, this.options)
    mergeOptionDefaults(parsed.values as Record<string, unknown>, this.options)

    parsed.values = objSortKeys(parsed.values, (a, b) => {
      return a[1] === false ? 1 : b[1] === false ? -1 : a[1] === true ? 1 : b[1] === true ? -1 : 0
    })

    const args = resolveArguments(parsed.positionals, this.arguments)
    const opts = filterObject(parsed.values, (value) => value !== undefined)
    const errors = validateParsed(args, parsed.values, this.arguments, this.options)
    const path = getCommandAncestors(this).map((c) => c.name)

    const data = {
      path,
      name: this.name,
      argv,
      args: args as Arguments,
      opts: opts as Options & O,
      errors,
      cmd: this as Command<Arguments, Options & O>,
    }

    const hooks = this.hooks.filter((t) => t.predicate(data))

    const execute = async () => {
      for (const hook of hooks) {
        await hook.action(data)
        if (process.exitCode) {
          return
        }
      }
      await timer([[...path, this.name].join(' '), this.description], async (logger) => {
        if (errors) {
          errors.forEach((msg) => logger.error(colors.red(msg)))
          process.exitCode = 1
          return
        }
        if (this.action) {
          return await this.action(...(args as A), opts as O, {
            ...data,
            args: args as A,
            opts: opts as O,
            cmd: this,
            logger,
          })
        }
        console.log(this.renderHelp())
      })
    }

    return { ...data, hooks, execute } as unknown as ParseArgvResult<Arguments, Options & O>
  }

  /**
   * Sets the main action handler for this command, which is executed after any matching option hooks when the command is invoked.
   * The handler receives parsed arguments and options with correct typings.
   */
  setAction(fn: ActionHandler<A, O, Subs>): this {
    this.action = setName(this.name, fn as never)
    return this
  }

  /** Returns a new Command instance. Override this method in subclasses. */
  protected createSubcommand(name: string): Command<[], O, {}> {
    return new Command<[], O, {}>(name, this)
  }
}
