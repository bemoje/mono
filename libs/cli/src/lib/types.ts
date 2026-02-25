import type { AllUnionFields } from 'type-fest'
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Command } from './Command'
import type { SetFieldType } from 'type-fest'
import type { SetRequired } from 'type-fest'
import type { Simplify } from 'type-fest'

/** Logger interface defining methods for different log levels. */
export interface Logger {
  start: (...args: unknown[]) => void
  done: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  log: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

/** Parsed command-line arguments */
export type Arguments = (undefined | string | string[])[]

/** Parsed command-line options */
export type Options = Record<string, undefined | boolean | string | string[]>

/** Result of parsing command-line input, including arguments, options, triggered actions, and execution method */

export type SubCommands = { [name: string]: Command<Arguments, Options, any> }

/** Base descriptor for command-line arguments with shared properties */
export interface Argument {
  usage: string
  name: string
  description?: string
  required?: boolean
  variadic?: boolean
  choices?: string[]
  defaultValue?: string | string[]
  defaultValueDescription?: string
}

/** Base descriptor for command-line options with shared properties */
export interface Option {
  type: 'boolean' | 'string'
  flags: string
  short: string
  long: string
  name: string
  argName?: string
  description?: string
  required?: boolean
  variadic?: boolean
  negate?: boolean
  defaultValue?: boolean | string | string[]
  defaultValueDescription?: string
  env?: string
  hidden?: boolean
  choices?: string[]
  group?: string
}

/** Complete command configuration including all properties and substructures */
export interface ICommand {
  /** Parent command if this is a subcommand */
  readonly parent?: ICommand
  /** Help configuration and rendering */
  // readonly help: IHelp
  /** Command name used for invocation */
  name: string
  /** Alternative names for this command */
  aliases: string[]
  /** Optional version string */
  version?: string
  /** Full command description */
  description: string
  /** Brief single-line description */
  summary?: string
  /** Whether command should be hidden from help */
  hidden?: boolean
  /** Group name for organizing commands in help */
  group?: string
  /** Positional arguments */
  arguments: Argument[]
  /** Named options/flags */
  options: Option[]
  /** Child subcommands */
  commands: { [name: string]: ICommand }
}

export interface IHelp {
  /** output helpWidth, long lines are wrapped to fit */
  helpWidth: number
  minWidthToWrap: number
  sortSubcommands: boolean
  sortOptions: boolean
  usageDisplayOptionsAs: string
  usageDisplaySubcommandAs: string
  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   */
  visibleCommands(): ICommand[]
  /**
   * Compare options for sort.
   */
  compareOptions(a: Option, b: Option): number
  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   */
  visibleOptions(): Option[]
  /**
   * Get an array of the arguments if any have a description.
   */
  visibleArguments(): Argument[]
  /**
   * Get the command term to show in the list of subcommands.
   */
  subcommandTerm(sub: ICommand): string
  /**
   * Get the option term to show in the list of options.
   */
  optionTerm(option: Option): string
  /**
   * Get the argument term to show in the list of arguments.
   */
  argumentTerm(argument: Argument): string
  /**
   * Get the longest subcommand primary alias length.
   */
  longestSubcommandAliasLength(): number
  /**
   * Get the longest subcommand term length.
   */
  longestSubcommandTermLength(): number
  /**
   * Get the longest option term length.
   */
  longestOptionTermLength(): number
  /**
   * Get the longest argument term length.
   */
  longestArgumentTermLength(): number
  /**
   * Get the command usage to be displayed at the top of the built-in help.
   */
  commandUsage(): string
  /**
   * Get the description for the command.
   */
  commandDescription(): string
  /**
   * Get the subcommand summary to show in the list of subcommands.
   * (Fallback to description for backwards compatibility.)
   */
  subcommandDescription(sub: ICommand): string
  /**
   * Get the option description to show in the list of options.
   */
  optionDescription(option: Option): string
  /**
   * Get the argument description to show in the list of arguments.
   */
  argumentDescription(argument: Argument): string
  /**
   * Format a list of items, given a heading and an array of formatted items.
   */
  formatItemList(heading: string, items: string[]): string[]
  /**
   * Group items by their help group heading.
   */
  groupItems<T extends ICommand | Option>(
    unsortedItems: T[],
    visibleItems: T[],
    getGroup: (item: T) => string,
  ): Map<string, T[]>
  /**
   * Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
   */
  displayWidth(str: string): number
  /**
   * Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
   */
  styleTitle(str: string): string
  /**
   * Style the usage line for displaying in the help. Applies specific styling to different parts like options, commands, and arguments.
   */
  styleUsage(str: string): string
  /**
   * Style command descriptions for display in help output.
   */
  styleCommandDescription(str: string): string
  /**
   * Style option descriptions for display in help output.
   */
  styleOptionDescription(str: string): string
  /**
   * Style subcommand descriptions for display in help output.
   */
  styleSubcommandDescription(str: string): string
  /**
   * Style argument descriptions for display in help output.
   */
  styleArgumentDescription(str: string): string
  /**
   * Base style used by descriptions. Override in subclass to apply custom formatting.
   */
  styleDescriptionText(str: string): string
  /**
   * Style option terms (flags) for display in help output.
   */
  styleOptionTerm(str: string): string
  /**
   * Style subcommand terms for display in help output. Applies specific styling to different parts like options and arguments.
   */
  styleSubcommandTerm(str: string): string
  /**
   * Style argument terms for display in help output.
   */
  styleArgumentTerm(str: string): string
  /**
   * Base style used in terms and usage for options. Override in subclass to apply custom formatting.
   */
  styleOptionText(str: string): string
  /**
   * Base style used in terms and usage for arguments. Override in subclass to apply custom formatting.
   */
  styleArgumentText(str: string): string
  /**
   * Base style used in terms and usage for subcommands. Override in subclass to apply custom formatting.
   */
  styleSubcommandText(str: string): string
  /**
   * Base style used in terms and usage for commands. Override in subclass to apply custom formatting.
   */
  styleCommandText(str: string): string
  /**
   * Calculate the pad width from the maximum term length.
   */
  padWidth(): number
  /**
   * Detect manually wrapped and indented strings by checking for line break followed by whitespace.
   */
  preformatted(str: string): boolean
  /**
   * Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
   *
   * So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
   *   TTT  DDD DDDD
   *        DD DDD
   */
  formatItem(term: string, termWidth: number, description: string): string
  /**
   * Wrap a string at whitespace, preserving existing line breaks.
   * Wrapping is skipped if the width is less than `minWidthToWrap`.
   */
  boxWrap(str: string, width: number): string
  /**
   * Generate the built-in help text.
   */
  render(): string
}

/** Action handler function type, which receives parsed arguments and options as well as metadata about the command execution context. */
export type ActionHandler<A extends Arguments, O extends Options, Subs extends SubCommands> = (
  ...args: [
    ...A,
    O,
    {
      path: string[]
      name: string
      argv: string[]
      args: A
      opts: O
      errors?: string[]
      cmd: Command<A, O, Subs>
      logger: Logger
    },
  ]
) => Promise<void> | void

/** Predicate function type for hooks, which receives the same metadata as action handlers and returns a boolean indicating whether the hook's action should be executed. */
export type HookPredicate<
  A extends Arguments = Arguments,
  O extends Options = Options,
  Subs extends SubCommands = SubCommands,
> = (data: {
  path: string[]
  name: string
  argv: string[]
  args: A
  opts: O
  errors?: string[]
  cmd: Command<A, O, Subs>
}) => boolean

/** Action handler function type for hooks, which receives the same metadata as action handlers and is executed when its predicate returns true. Can also throw to indicate an error. */
export type HookActionHandler<
  A extends Arguments = Arguments,
  O extends Options = Options,
  Subs extends SubCommands = SubCommands,
> = (data: {
  path: string[]
  name: string
  argv: string[]
  args: A
  opts: O
  errors?: string[]
  cmd: Command<A, O, Subs>
}) => Promise<void> | void | never

/** Hook definition type, which includes the option name that triggers the hook, a predicate function to determine when the hook should run, and an action handler to execute when triggered. */
export type HookDefinition<
  A extends Arguments = Arguments,
  O extends Options = Options,
  Subs extends SubCommands = SubCommands,
> = {
  name: keyof O
  predicate: HookPredicate<A, O, Subs>
  action: HookActionHandler<A, O, Subs>
}

/**
 * @see Command.prototype.parseArgv
 */
export type ParseArgvResult<
  A extends Arguments = Arguments,
  O extends Options = Options,
  Subs extends SubCommands = SubCommands,
> = {
  /** The command or subcommand instance */
  get cmd(): Command<A, O, Subs>
  /** The part of argv that makes out a subcommand path, or empty array when root command */
  path: string[]
  /** Command namer */
  name: string
  /** Original argv array passed in or from process.argv, excluding subcommand path */
  argv: string[]
  /** Parsed arguments */
  args: A
  /** Parsed options */
  opts: O
  /** Error messages if parsing failed, otherwise undefined */
  errors?: string[]
  /** Names of all triggered hooks whose predicate returned true */
  hooks: HookDefinition<A, O, Subs>[]

  /** Calls the action handler with its expected args */
  execute: () => Promise<void>
}

/** required variadic argument */
export type RequiredVariadicArgumentUsage = `<${string}...>`

/** optional variadic argument */
export type OptionalVariadicArgumentUsage = `[${string}...]`

/** required argument */
export type RequiredArgumentUsage = `<${string}>`

/** optional argument */
export type OptionalArgumentUsage = `[${string}]`

/** Union of all argument usage pattern types */
export type ArgumentUsage =
  | RequiredVariadicArgumentUsage
  | OptionalVariadicArgumentUsage
  | RequiredArgumentUsage
  | OptionalArgumentUsage

/** Helper type to infer allowed argument usage patterns based on the command's existing argument types */
type InferArgumentUsage<T extends Command<any, any, any>> =
  T extends Command<infer A, any>
    ? A extends string[]
      ? ArgumentUsage
      : A extends (string | (string | undefined))[]
        ? OptionalArgumentUsage | OptionalVariadicArgumentUsage
        : never
    : never

/** Helper type to infer allowed argument usage patterns based on the command's existing argument types */
export type AllowedArgumentUsage<T extends Command<any, any, any>, Usage extends ArgumentUsage> =
  Usage extends InferArgumentUsage<T> ? Usage : never

/** Base type for addArgument options, extended by specific required/optional and variadic/non-variadic argument option types */
type ArgumentOptionsBase = Omit<
  Argument,
  'name' | 'required' | 'variadic' | 'usage' | 'defaultValue' | 'defaultValueDescription'
>

/** Base type for addArgument options, extended by specific required/optional and variadic/non-variadic argument option types */
type ExtendArgumentOptionsBase<T extends object = object> = Simplify<ArgumentOptionsBase & T>

/** Required positional argument descriptor. Usage: `<name>` */
export type RequiredArgumentOptions = ExtendArgumentOptionsBase

/** Optional positional argument with string default. Usage: `[name]` */
export type OptionalArgumentOptions = ExtendArgumentOptionsBase<{
  defaultValue?: string
  defaultValueDescription?: string
}>

/** Optional positional argument with required string default. Usage: `[name]` */
export type OptionalArgumentOptionsWithDefaultValue = SetFieldType<
  SetRequired<OptionalArgumentOptions, 'defaultValue'>,
  'defaultValue',
  string
>

/** Required variadic argument accepting variadic values. Usage: `<name...>` */
export type RequiredVariadicArgumentOptions = ExtendArgumentOptionsBase

/** Optional variadic argument with array default. Usage: `[name...]` */
export type OptionalVariadicArgumentOptions = ExtendArgumentOptionsBase<{
  defaultValue?: string[]
  defaultValueDescription?: string
}>

/** Union of all addArgument options types */
export type ArgumentOptions = AllUnionFields<
  | RequiredArgumentOptions
  | OptionalArgumentOptions
  | OptionalArgumentOptionsWithDefaultValue
  | RequiredVariadicArgumentOptions
  | OptionalVariadicArgumentOptions
>

/** Helper type for extracting argument name from usage pattern */
export type InferAddedArgumentType<Opts> = Opts extends { choices: infer C extends string[] } ? C[number] : string

/** Union of all option usage pattern types */
export type OptionUsage<Long extends string> =
  // boolean flag
  | `-${string}, --${Long}`
  // required string option
  | `-${string}, --${Long} <${string}>`
  // optional string option
  | `-${string}, --${Long} [${string}]`
  // required variadic option
  | `-${string}, --${Long} <${string}...>`
  // optional variadic option
  | `-${string}, --${Long} [${string}...]`

/** Base type for addOption options, extended by specific boolean/string and required/optional and variadic/non-variadic option types */
type OptionOptionsBase = Omit<
  Option,
  'name' | 'required' | 'variadic' | 'type' | 'argName' | 'short' | 'long' | 'flags'
>

/** Helper type to extend base addOption options with specific fields for different option types */
type ExtendAddOptionOptionsBase<T extends object = object> = Simplify<OptionOptionsBase & T>

/** Boolean flag option. Usage: `-v, --verbose` */
export type BooleanOptionOptions = ExtendAddOptionOptionsBase<{
  defaultValue?: boolean
  defaultValueDescription?: string
}>

/** Required string option. Usage: `-f, --file <path>` */
export type RequiredOptionOptions = ExtendAddOptionOptionsBase<{
  env?: undefined
}>

/** Optional string option with default. Usage: `-o, --output [path]` */
export type OptionalOptionOptions = ExtendAddOptionOptionsBase<{
  defaultValue?: string
  defaultValueDescription?: string
}>

/** Required option accepting variadic values. Usage: `-i, --include <patterns...>` */
export type RequiredVariadicOptionOptions = ExtendAddOptionOptionsBase<{
  env?: undefined
}>

/** Optional option accepting variadic values with defaults. Usage: `-e, --exclude [patterns...]` */
export type OptionalVariadicOptionOptions = ExtendAddOptionOptionsBase<{
  defaultValue?: string[]
  defaultValueDescription?: string
}>

/** Union of all addOption options types */
export type OptionOptions = AllUnionFields<
  | BooleanOptionOptions
  | RequiredOptionOptions
  | OptionalOptionOptions
  | RequiredVariadicOptionOptions
  | OptionalVariadicOptionOptions
>

/** Helper type to infer the resulting Command type after adding an option with specific options */
export type InferAddOptionResult<
  A extends Arguments,
  O extends Options,
  NewOptions extends Options,
  Subs extends SubCommands,
> = Command<A, Simplify<O & NewOptions>, Subs>
