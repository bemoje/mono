import { sortBy } from 'lodash-es'
import { tsCrlfToLf } from './tsCrlfToLf'
import { tsStripImports } from './tsStripImports'
import { tsExtractImports } from './tsExtractImports'

/**
 * Sorts import statements in TypeScript code alphabetically by module specifier.
 * This function extracts all import statements, sorts them alphabetically by the module path,
 * and reconstructs the code with sorted imports at the top.
 * @param code - The TypeScript code string containing import statements
 * @param imports - Optional pre-extracted imports to avoid re-parsing
 * @returns The code with imports sorted alphabetically
 * @example
 * ```typescript
 * const code = `import { z } from 'z-module'
 * import { a } from 'a-module'
 *
 * const someCode = 'value'`
 *
 * tsSortImports(code)
 * // Returns:
 * // import { a } from 'a-module'
 * // import { z } from 'z-module'
 * //
 * // const someCode = 'value'
 * ```
 */
export function tsSortImports(code: string, imports?: ReturnType<typeof tsExtractImports>): string {
  code = tsCrlfToLf(code)
  const imps = imports ?? tsExtractImports(code)
  const withoutImports = tsStripImports(code, imps)
  const onlyImports = imps.map((imp) => imp.match)
  const sortedImports = sortBy(onlyImports, (line) => line.replace(/.* from '/, '') + line)
  return (
    [sortedImports.join('\n'), withoutImports]
      .join('\n\n')
      .replace(/\n\n\n+/g, '\n\n')
      .trim() + '\n'
  )
}
