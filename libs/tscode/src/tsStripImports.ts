import { tsCrlfToLf } from './tsCrlfToLf'
import { tsExtractImports } from './tsExtractImports'

/**
 * Removes import statements from TypeScript code.
 */
export function tsStripImports(code: string, imports?: ReturnType<typeof tsExtractImports>): string {
  code = tsCrlfToLf(code)
  const imps = imports ?? tsExtractImports(code)
  return imps.reduce((acc, imp) => acc.replace(imp.match, ''), code)
}
