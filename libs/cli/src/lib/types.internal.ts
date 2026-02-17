import type { Command } from './Command'
import type { Arguments, IArgument, ICommand, IOption, Options } from './types'
import type { Simplify, AllUnionFields } from 'type-fest'

/** Union of all argument usage pattern types */
export type ArgumentUsage =
  // required argument
  | `<${string}>`
  // optional argument
  | `[${string}]`
  // required variadic argument
  | `<${string}...>`
  // optional variadic argument
  | `[${string}...]`

/** Required positional argument descriptor. Usage: `<name>` */
export type IRequiredArgument = ArgOpts

/** Optional positional argument with string default. Usage: `[name]` */
export type IOptionalArgument = ArgOpts<{
  defaultValue?: string
  defaultValueDescription?: string
}>

/** Required variadic argument accepting variadic values. Usage: `<name...>` */
export type IRequiredVariadicArgument = ArgOpts

/** Optional variadic argument with array default. Usage: `[name...]` */
export type IOptionalVariadicArgument = ArgOpts<{
  defaultValue?: string[]
  defaultValueDescription?: string
}>

/** Helper type for extracting argument configuration options */
export type ArgOpts<T extends object = object> = Simplify<
  Omit<
    IArgument,
    'name' | 'description' | 'required' | 'variadic' | 'usage' | 'defaultValue' | 'defaultValueDescription'
  > &
    T
>

export type ArgumentOptions = AllUnionFields<
  IRequiredArgument | IOptionalArgument | IRequiredVariadicArgument | IOptionalVariadicArgument
>

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

/** Boolean flag option. Usage: `-v, --verbose` */
export type IBooleanOption = OptOpts<{
  defaultValue?: boolean
  defaultValueDescription?: string
}>

/** Required string option. Usage: `-f, --file <path>` */
export type IRequiredOption = OptOpts<{
  env?: undefined
}>

/** Optional string option with default. Usage: `-o, --output [path]` */
export type IOptionalOption = OptOpts<{
  defaultValue?: string
  defaultValueDescription?: string
}>

/** Required option accepting variadic values. Usage: `-i, --include <patterns...>` */
export type IRequiredVariadicOption = OptOpts<{
  env?: undefined
}>

/** Optional option accepting variadic values with defaults. Usage: `-e, --exclude [patterns...]` */
export type IOptionalVariadicOption = OptOpts<{
  defaultValue?: string[]
  defaultValueDescription?: string
}>

export type OptionOptions = AllUnionFields<
  IBooleanOption | IRequiredOption | IOptionalOption | IRequiredVariadicOption | IOptionalVariadicOption
>

/** Helper type for extracting option configuration options */
export type OptOpts<T extends object = object> = Simplify<
  Omit<
    IOption,
    'name' | 'description' | 'required' | 'variadic' | 'type' | 'argName' | 'short' | 'long' | 'flags'
  > &
    T
>

export type TriggerPredicate<A extends Arguments, O extends Options, C extends ICommand> = (data: {
  args: A
  opts: O
  cmd: C
}) => boolean

export type ActionHandler<A extends Arguments, O extends Options, C extends ICommand> = (data: {
  args: A
  opts: O
  triggers: TriggerDefinition<A, O, C>[]
  cmd: C
}) => Promise<void> | void

/**
 * @see Command.prototype.parseArgv
 */
export type ParseArgvResult<A extends Arguments, O extends Options, C extends ICommand> = {
  /** The command or subcommand instance */
  get cmd(): C
  /** The part of argv that makes out a subcommand path, or empty array when root command */
  path: string[]
  /** Original argv array passed in or from process.argv, excluding subcommand path */
  argv: string[]
  /** Parsed arguments */
  args: A
  /** Parsed options */
  opts: O
  /** Names of all triggered triggers whose predicate returned true */
  triggers: TriggerDefinition<A, O, C>[]
  /** name of the trigger or 'main' for action handler */
  action?: string
  /** Calls the action handler with its expected args */
  execute?: () => Promise<void> | void
}

export type TriggerDefinition<A extends Arguments, O extends Options, C extends ICommand> = {
  name: keyof O
  predicate: TriggerPredicate<A, O, C>
  action: ActionHandler<A, O, C>
}

export type InferNewOptions<A extends Arguments, O extends Options, NewOptions extends Options> = Command<
  A,
  NewOptions & O
>
