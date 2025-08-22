/**
 * Removes the 'import' and 'type' keywords from an import statement line.
 * @param line - The import statement line to strip keywords from
 * @returns The import statement with keywords removed
 * @example
 * ```typescript
 * importStatementStripKeywords('import type { Foo } from "bar"') // '{ Foo } from "bar"'
 * importStatementStripKeywords('import { Foo } from "bar"') // '{ Foo } from "bar"'
 * ```
 */
export function importStatementStripKeywords(line: string) {
  return line.replace(/^import +(type +)?/g, '')
}
