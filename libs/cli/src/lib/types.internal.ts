/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Command } from './Command'
import type { Arguments, Argument, Option, Options, SubCommands } from './types'
import type { Simplify, AllUnionFields, SetFieldType, SetRequired } from 'type-fest'

export type HookPredicate<A extends Arguments, O extends Options, Subs extends SubCommands> = (data: {
  path: string[]
  argv: string[]
  args: A
  opts: O
  errors?: string[]
  action: string
  cmd: Command<A, O, Subs>
}) => boolean

export type ActionHandler<A extends Arguments, O extends Options, Subs extends SubCommands> = (data: {
  path: string[]
  argv: string[]
  args: A
  opts: O
  errors?: string[]
  cmd: Command<A, O, Subs>
}) => Promise<void> | void

/**
 * @see Command.prototype.parseArgv
 */
export type ParseArgvResult<A extends Arguments, O extends Options, Subs extends SubCommands> = {
  /** The command or subcommand instance */
  get cmd(): Command<A, O, Subs>
  /** The part of argv that makes out a subcommand path, or empty array when root command */
  path: string[]
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
  /** name of the trigger or 'main' for action handler */
  action: string
  /** Calls the action handler with its expected args */
  execute: () => Promise<void>
}

export type HookDefinition<A extends Arguments, O extends Options, Subs extends SubCommands> = {
  name: keyof O
  predicate: HookPredicate<A, O, Subs>
  action: ActionHandler<A, O, Subs>
}

//
// argument usage
//

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

//
// argument options
//

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

//
// argument type
//

/** Helper type for extracting argument name from usage pattern */
export type InferAddedArgumentType<Opts> = Opts extends { choices: infer C extends string[] } ? C[number] : string

//
// option usage
//

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

//
// option options
//

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

//
// addOption return type
//

/** Helper type to infer the resulting Command type after adding an option with specific options */
export type InferAddOptionResult<
  A extends Arguments,
  O extends Options,
  NewOptions extends Options,
  Subs extends SubCommands,
> = Command<A, Simplify<O & NewOptions>, Subs>
