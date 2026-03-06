import type { SuggestOptions } from './common'
import { escapeRegExp } from 'es-toolkit/string'

/**
 * Create a regular expression that matches strings containing the keyword.
 *
 * @param opts - The suggest options.
 * @param kw - The keyword to match.
 */
export function regIncludes(opts: SuggestOptions, kw: string) {
  const regCaseFlag = opts.caseInsensitive ? 'i' : ''
  try {
    return new RegExp(opts.regexMode ? kw : escapeRegExp(kw), regCaseFlag)
  } catch (_) {
    return new RegExp(escapeRegExp(kw), regCaseFlag)
  }
}
