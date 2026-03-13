import { sortBy } from 'es-toolkit/compat'
import { tsCrlfToLf } from './tsCrlfToLf'
import { tsExtractImports } from './tsExtractImports'
import { tsStripImports } from './tsStripImports'

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
  const onlyImports = imps.map((imp) => {
    return imp.match
  })
  const sortedImports = sortBy(onlyImports, (line) => {
    return line.replace(/.* from '/, '') + line
  })
  return `${[sortedImports.join('\n'), withoutImports]
    .join('\n\n')
    .replaceAll(/\n\n\n+/g, '\n\n')
    .trim()}\n`
}
