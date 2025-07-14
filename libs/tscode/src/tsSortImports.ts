import { sortBy } from 'lodash-es'
import { tsCrlfToLf } from './tsCrlfToLf'
import { tsStripImports } from './tsStripImports'
import { tsExtractImports } from './tsExtractImports'

/**
 * Sorts import statements in TypeScript code alphabetically by module specifier.
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
