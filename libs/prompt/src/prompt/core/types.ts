import type { IChoice } from '../additions/searchPrompt/core/IChoice'
import type { LocalesMonths } from '@mono/types'
import type { LocalesWeeks } from '@mono/types'
import type { PromptObject } from 'prompts'
import type { PromptType } from 'prompts'
import { Readable } from 'stream'
import { Writable } from 'stream'

export type {
  LocaleMonthNames,
  LocaleWeekDayNames,
  LocalesMonths,
  LocaleMonthFullNames,
  LocaleMonthShortNames,
  LocalesWeeks,
  LocaleWeekDayFullNames,
  LocaleWeekDayShortNames,
} from '@mono/types'

/**
 * Use to define custom locales. More info:
 * https://github.com/terkelg/prompts/wiki/Date-Time-Formatting
 */
export type TLocales = LocalesMonths & LocalesWeeks

/**
 * Receive the user input and return the formatted value to be used inside the program. The value returned will be added to the response object.
 * The function signature is (val, values), where val is the value from the current prompt and values is the current response object in case you need to format based on previous responses.
 */
export type TFormat<T> = (this: PromptObject, val: string, values: Record<string, T>) => T

/**
 * Receive user input. Should return true if the value is valid, and an error message String otherwise. If false is returned, a default error message is shown
 */
export type TValidate<T> = (this: PromptObject, value: T) => boolean | string

/**
 * state is an object with a snapshot of the current state. The state object has two properties value and aborted. E.g { value: 'This is ', aborted: false }
 */
export type TStateObject = { value: string; aborted: boolean; exited: boolean }

/**
 * Callback for when the state of the current prompt changes. The function signature is (state)
 * @see TStateObject
 */
export type TOnState = (this: PromptObject, state: TStateObject) => void

/**
 * Callback for when the prompt is rendered. The function receives kleur as its first argument and this refers to the current prompt.
 */
export type TOnRender = (this: PromptObject, kleur: unknown) => void

/**
 * Text for active state. Defaults to 'on'
 */
export type TActive = 'on' | 'off' | 'yes' | 'no'

/**
 * Text for inactive state. Defaults to 'off'
 */
export type TInactive = 'on' | 'off' | 'yes' | 'no'
/**
 * Render style.
 */
export type TStyle = 'default' | 'password' | 'invisible' | 'emoji'

/**
 * Filter function. Defaults to sort by title property. suggest should always return a promise. Filters using title by default
 */
export type TSuggest<T> = (this: PromptObject, input: T, choices: IChoice<T>[]) => Promise<IChoice<T>[]>

/**
 * By default, prompts uses process.stdin for receiving input and process.stdout for writing output.
 * If you need to use different streams, for instance process.stderr, you can set these with the stdin and stdout properties.
 */
export type TStdout = Writable | undefined

/**
 * By default, prompts uses process.stdin for receiving input and process.stdout for writing output.
 * If you need to use different streams, for instance process.stderr, you can set these with the stdin and stdout properties.
 */
export type TStdin = Readable | undefined

/**
 * PromptObject with the fields they all have in common.
 */
export interface ICommonPromptFields extends PromptObject {
  type: PromptType
  name: string
  message: string
  onRender?: TOnRender
  onState?: TOnState
  stdin?: TStdin
  stdout?: TStdout
}

/**
 * Text prompt
 */
export interface ITextPrompt<T extends string = string> extends ICommonPromptFields {
  type: 'text'
  validate?: TValidate<T>
  initial?: T
  style?: TStyle
  format?: TFormat<T>
}

/**
 * Password prompt with masked input
 */
export interface IPasswordPrompt<T extends string = string> extends ICommonPromptFields {
  type: 'password'
  validate?: TValidate<T>
  initial?: T
  format?: TFormat<T>
}

/**
 * Prompt where input is invisible, like sudo
 */
export interface IInvisiblePrompt<T extends string = string> extends ICommonPromptFields {
  type: 'invisible'
  validate?: TValidate<T>
  initial?: T
  format?: TFormat<T>
}

/**
 * Number prompt
 */
export interface INumberPrompt<T extends number = number> extends ICommonPromptFields {
  type: 'number'
  validate?: TValidate<T>
  initial?: T
  format?: TFormat<T>
  min?: number
  max?: number
  float?: boolean
  round?: number
  increment?: number
  style?: TStyle
}

/**
 * Classic yes/no prompt
 */
export interface IConfirmPrompt<T extends boolean = boolean> extends ICommonPromptFields {
  type: 'confirm'
  name: string
  initial?: T
  format?: TFormat<T>
}

/**
 * List prompt, split intput string by `seperator`
 */
export interface IListPrompt<T extends string = string> extends ICommonPromptFields {
  type: 'list'
  validate?: TValidate<T>
  style?: TStyle
  format?: TFormat<T>
  initial?: T
  separator?: string
}

/**
 * Toggle/switch prompt
 */
export interface ITogglePrompt<T extends boolean = boolean> extends ICommonPromptFields {
  type: 'toggle'
  validate?: TValidate<T>
  initial?: T
  format?: TFormat<T>
  active?: TActive
  inactive?: TInactive
}

/**
 * Interactive select prompt
 */
export interface ISelectPrompt<T extends string | number | boolean = number> extends ICommonPromptFields {
  type: 'select'
  validate?: TValidate<T>
  initial?: T
  format?: TFormat<T>
  hint?: string
  warn?: string
  choices?: IChoice<T>[]
}

/**
 * Interactive multi-select / autocompleteMultiselect prompt
 */
export interface IMultiselectPrompt<T extends string | number | boolean = number> extends ICommonPromptFields {
  type: 'multiselect'
  validate?: TValidate<T>
  format?: TFormat<T>
  instructions?: string
  choices?: IChoice<T>[]
  optionsPerPage?: number
  min?: number
  max?: number
  hint?: string
  warn?: string
}

/**
 * Interactive multi-select / autocompleteMultiselect prompt
 */
export interface IAutocompleteMultiselectPrompt<T extends string = string> extends ICommonPromptFields {
  type: 'autocompleteMultiselect'
  validate?: TValidate<T>
  format?: TFormat<T>
  instructions?: string
  choices?: IChoice<T>[]
  suggest?: TSuggest<T>
  optionsPerPage?: number
  min?: number
  max?: number
  hint?: string
  warn?: string
}

/**
 * Autocompletion prompt
 */
export interface IAutocompletePrompt<T extends string = string> extends ICommonPromptFields {
  type: 'autocomplete'
  validate?: TValidate<T>
  format?: TFormat<T>
  choices?: IChoice<T>[]
  suggest?: TSuggest<T>
  limit?: number
  style?: TStyle
  initial?: T
  clearFirst?: boolean
  fallback?: string
}

/**
 * Date prompt
 */
export interface IDatePrompt<T extends Date = Date> extends ICommonPromptFields {
  type: 'date'
  validate?: TValidate<T>
  initial?: T
  locales?: TLocales
  mask?: string
}
