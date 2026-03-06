import type { SuggestOptions } from './common'
import { escapeRegExp } from 'es-toolkit/string'

/**
 * Create a regular expression that matches the keyword exactly.
 *
 * @param opts - The suggest options.
 * @param kw - The keyword to match.
 */
export function regExact(opts: SuggestOptions, kw: string) {
  const regCaseFlag = opts.caseInsensitive ? 'i' : ''
  try {
    return new RegExp(`^${opts.regexMode ? kw : escapeRegExp(kw)}$`, regCaseFlag)
  } catch (_) {
    return new RegExp(`^${escapeRegExp(kw)}$`, regCaseFlag)
  }
}
