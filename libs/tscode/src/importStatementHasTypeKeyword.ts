/**
 * Checks if an import statement line contains the 'type' keyword.
 * @param line - The import statement line to check
 * @returns True if the line starts with 'import type', false otherwise
 * @example
 * ```typescript
 * importStatementHasTypeKeyword('import type { Foo } from "bar"') // true
 * importStatementHasTypeKeyword('import { Foo } from "bar"') // false
 * ```
 */
export function importStatementHasTypeKeyword(line: string) {
  return line.startsWith('import type ')
}
