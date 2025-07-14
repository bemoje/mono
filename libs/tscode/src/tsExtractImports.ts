import { importStatementToOneLiner } from './importStatementToOneLiner'
import { tsCrlfToLf } from './tsCrlfToLf'
import { ITsExtractImportsResult } from './ITsExtractImportsResult'

/**
 * Extract all import statements from a given TypeScript source code string.
 * @param code The TypeScript code as a string from which to extract import statements.
 * @returns An array of objects, each representing an import statement. Each object includes the start and end line numbers (0-indexed) of the import statement in the original code, and the full text of the import statement.
 */
export function tsExtractImports(code: string): ITsExtractImportsResult[] {
  code = tsCrlfToLf(code)
  const isFirstLine = /^import /
  const isFirstLineInMulti = /\{\s*$/
  const isLastLineInMulti = /^\} from '/
  const result: ITsExtractImportsResult[] = []
  let isMulti = false
  let impLines = []
  const lines = code.split(/\r?\n/)
  for (let l = 0; l < lines.length; l++) {
    const line = lines[l]
    if (isFirstLine.test(line)) {
      if (isFirstLineInMulti.test(line)) {
        impLines.push(line)
        isMulti = true
      } else {
        const match = line
        result.push({ start: l, end: l + 1, match, matchOneLine: importStatementToOneLiner(match) })
      }
    } else if (isMulti) {
      impLines.push(line)
      if (isLastLineInMulti.test(line)) {
        const match = impLines.join('\n')
        result.push({
          start: l - impLines.length + 1,
          end: l + 1,
          match,
          matchOneLine: importStatementToOneLiner(match),
        })
        impLines = []
        isMulti = false
      }
    }
  }
  return result
}
