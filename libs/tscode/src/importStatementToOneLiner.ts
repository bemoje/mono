import strip from 'strip-comments'

/**
 * Converts a multi-line import statement to a single line by removing comments and extra whitespace.
 * This function strips comments, normalizes whitespace, and removes trailing commas to create
 * a clean single-line import statement.
 * @param code - The import statement code to convert
 * @returns A single-line import statement with normalized formatting
 * @example
 * ```typescript
 * const multilineImport = `import {
 *   foo,
 *   bar
 * } from 'module'`
 *
 * importStatementToOneLiner(multilineImport)
 * // 'import { foo, bar } from 'module''
 * ```
 */
export function importStatementToOneLiner(code: string) {
  return (
    strip(code)
      // remove newlines
      .replace(/\r*\n/g, ' ')
      // remove consecutive whitespace
      .replace(/\s+/g, ' ')
      // remove trailing commas
      .replace(/,\s*\}/, ' }')
      // Normalize spaces around commas
      .replace(/\s*,\s*/g, ', ')
      // remove consecutive whitespace
      .replace(/\s+/g, ' ')
      // remove leading and trailing whitespace
      .trim()
  )
}
