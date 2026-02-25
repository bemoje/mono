import { tsCrlfToLf } from './tsCrlfToLf'
import { tsExtractImports } from './tsExtractImports'

/**
 * Removes import statements from TypeScript code.
 * This function extracts all import statements and removes them from the source code,
 * leaving only the non-import content.
 * @param code - The TypeScript code string to strip imports from
 * @param imports - Optional pre-extracted imports to avoid re-parsing
 * @returns The code with all import statements removed
 * @example
 * ```typescript
 * const code = `import { foo } from 'bar'
 * import baz from 'qux'
 *
 * const someCode = 'value'`
 *
 * tsStripImports(code)
 * // Returns: '\n\n\nconst someCode = 'value''
 * ```
 */
export function tsStripImports(code: string, imports?: ReturnType<typeof tsExtractImports>): string {
  code = tsCrlfToLf(code)
  const imps = imports ?? tsExtractImports(code)
  return imps.reduce((acc, imp) => {
    return acc.replace(imp.match, '')
  }, code)
}
