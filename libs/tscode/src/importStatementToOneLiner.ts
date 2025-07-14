import strip from 'strip-comments'
import { tsCrlfToLf } from './tsCrlfToLf'

/**
 * Converts a multi-line import statement to a single line by removing comments and extra whitespace.
 */
export function importStatementToOneLiner(code: string) {
  code = tsCrlfToLf(code)
  return strip(code)
    .replace(/ *(\r?\n)+\s*/g, ' ')
    .replace(", } from '", " } from '")
    .replace(/\s+/g, ' ') // Collapse multiple spaces to single space
    .replace(/\s*,\s*/g, ', ') // Normalize spaces around commas
    .trim()
}
