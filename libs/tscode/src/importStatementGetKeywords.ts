/**
 * Extracts keywords from an import statement line (e.g., 'type' from 'import type').
 * @param line - The import statement line to extract keywords from
 * @returns An array of keywords found in the import statement, or empty array if none
 * @example
 * ```typescript
 * importStatementGetKeywords('import type { Foo } from "bar"') // ['type']
 * importStatementGetKeywords('import { Foo } from "bar"') // []
 * ```
 */
export function importStatementGetKeywords(line: string) {
  return (
    line
      .match(/^import +(type +)?/)?.[1]
      ?.split(/ +/g)
      .map((s) => s.trim())
      .filter(Boolean) || []
  )
}
