import type { SuggestOptions } from './common'
import { escapeRegExp } from 'es-toolkit'

/**
 * Create a regular expression that matches strings starting with the keyword.
 *
 * @param opts - The suggest options.
 * @param kw - The keyword to match.
 */
export function regStartsWith(opts: SuggestOptions, kw: string) {
  const regCaseFlag = opts.caseInsensitive ? 'i' : ''
  try {
    return new RegExp(`^${opts.regexMode ? kw : escapeRegExp(kw)}`, regCaseFlag)
  } catch (_) {
    return new RegExp(`^${escapeRegExp(kw)}`, regCaseFlag)
  }
}
