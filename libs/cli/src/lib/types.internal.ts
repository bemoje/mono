import type { WithRequired } from '@mono/types'
import type { Command } from './Command'
import type { Arguments, IArgument, ICommand, IOption, Options } from './types'
import type { Simplify, AllUnionFields, SetFieldType, SetRequired } from 'type-fest'

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

export type InferArgumentName<T extends ArgumentUsage> = T extends `<${infer Name}...>`
  ? Name
  : T extends `<${infer Name}>`
    ? Name
    : T extends `[${infer Name}...]`
      ? Name
      : T extends `[${infer Name}]`
        ? Name
        : never

export type InferArgumentRequired<T extends ArgumentUsage> = T extends RequiredArgumentUsage
  ? true
  : T extends OptionalArgumentUsage
    ? false
    : never

export type InferArgumentVariadic<T extends ArgumentUsage> = T extends RequiredVariadicArgumentUsage
  ? true
  : T extends OptionalVariadicArgumentUsage
    ? true
    : T extends RequiredArgumentUsage
      ? false
      : T extends OptionalArgumentUsage
        ? false
        : never

export type InferArgumentDefaultValue<T extends ArgumentUsage> = T extends OptionalVariadicArgumentUsage
  ? string[]
  : T extends OptionalArgumentUsage
    ? string
    : never

export type InferArgument<T extends ArgumentUsage> = Simplify<
  {
    usage: T
    name: InferArgumentName<T>
    description: string
    choices?: string[]
  } & (T extends RequiredVariadicArgumentUsage
    ? {
        required: true
        variadic: true
        defaultValue?: undefined | never
        defaultValueDescription?: undefined | never
      }
    : T extends OptionalVariadicArgumentUsage
      ? { required: false; variadic: true; defaultValue: string[]; defaultValueDescription?: string }
      : T extends RequiredArgumentUsage
        ? {
            required: true
            variadic: false
            defaultValue?: undefined | never
            defaultValueDescription?: undefined | never
          }
        : T extends OptionalArgumentUsage
          ? { required: false; variadic: false; defaultValue?: string; defaultValueDescription?: string }
          : never)
>

export type InferArgumentOptions<T extends ArgumentUsage> = Omit<
  InferArgument<T>,
  'usage' | 'name' | 'required' | 'variadic'
>

/** Required positional argument descriptor. Usage: `<name>` */
export type IRequiredArgument = ArgOpts

/** Optional positional argument with string default. Usage: `[name]` */
export type IOptionalArgument = ArgOpts<{
  defaultValue?: string
  defaultValueDescription?: string
}>

export type IOptionalArgumentWithDefault = SetFieldType<
  SetRequired<IOptionalArgument, 'defaultValue'>,
  'defaultValue',
  string
>

/** Required variadic argument accepting variadic values. Usage: `<name...>` */
export type IRequiredVariadicArgument = ArgOpts

/** Optional variadic argument with array default. Usage: `[name...]` */
export type IOptionalVariadicArgument = ArgOpts<{
  defaultValue?: string[]
  defaultValueDescription?: string
}>

/** Helper type for extracting argument configuration options */
export type ArgOpts<T extends object = object> = Simplify<
  Omit<IArgument, 'name' | 'required' | 'variadic' | 'usage' | 'defaultValue' | 'defaultValueDescription'> & T
>

export type ArgumentOptions = AllUnionFields<
  IRequiredArgument | IOptionalArgument | IRequiredVariadicArgument | IOptionalVariadicArgument
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferAddArgumentUsage<T extends Command<any, any>> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Command<infer A, any>
    ? A extends string[]
      ? ArgumentUsage
      : A extends (string | (string | undefined))[]
        ? OptionalArgumentUsage | OptionalVariadicArgumentUsage
        : never
    : never

export type InferAddArgumentUsageSpecific<T extends Command<any, any>, Usage extends ArgumentUsage> =
  Usage extends InferAddArgumentUsage<T> ? Usage : never

export type InferNewArgument<Opts> = Opts extends { choices: infer C extends string[] } ? C[number] : string

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
