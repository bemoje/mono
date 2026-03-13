/**
 * Options for the suggest filtering functions.
 */
export interface SuggestOptions {
  caseInsensitive: boolean
  regexMode: boolean
}

export { initChoices } from './initChoices'
export { regExact } from './regExact'
export { regIncludes } from './regIncludes'
export { regStartsWith } from './regStartsWith'
