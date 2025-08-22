import { importStatementToOneLiner } from './importStatementToOneLiner'

/**
 * Converts a multi-line import statement to a formatted single line with proper spacing.
 * Adds spaces around braces, keywords, and other import statement elements for readability.
 * @param code - The import statement code to format
 * @returns A formatted single-line import statement
 * @example
 * ```typescript
 * importStatementToFormattedOneLiner('import{foo,bar}from"module"')
 * // 'import { foo, bar } from "module"'
 *
 * importStatementToFormattedOneLiner('import*as foo from"module"')
 * // 'import * as foo from "module"'
 * ```
 */
export function importStatementToFormattedOneLiner(code: string) {
  return importStatementToOneLiner(code)
    .replace(/[{}]|\bfrom\b|\*|\bas\b/g, (m) => ' ' + m + ' ')
    .replace(/\s+,\s*/g, ', ')
    .replace(/\s\s+/g, ' ')
    .trim()
}
