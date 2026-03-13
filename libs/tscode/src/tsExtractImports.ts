import { importStatementToOneLiner } from './importStatementToOneLiner'
import { tsCrlfToLf } from './tsCrlfToLf'

/**
 * Extract all import statements from a given TypeScript source code string.
 * This function parses TypeScript code to identify and extract all import statements,
 * handling both single-line and multi-line imports. It correctly ignores import-like
 * text within comments and string literals.
 * @param code - The TypeScript code as a string from which to extract import statements
 * @returns An array of objects, each representing an import statement. Each object includes
 *          the start and end line numbers (0-indexed) of the import statement in the original code,
 *          the full text of the import statement, and a one-line version
 */
export function tsExtractImports(code: string): TsExtractImportsResult[] {
  code = tsCrlfToLf(code)
  code = replaceImportStatementsInsideLiteralStrings(code)
  code = replaceImportStatementsInsideBlockComments(code)
  const isFirstLine = /^import /
  const isFirstLineInMulti = /{\s*$/
  const isLastLineInMulti = /^} from ["']/
  const result: TsExtractImportsResult[] = []
  let isMulti = false
  let impLines = []
  const lines = code.split(/\r?\n/)
  for (const [l, line] of lines.entries()) {
    if (isFirstLine.test(line)) {
      if (isFirstLineInMulti.test(line)) {
        impLines.push(line)
        isMulti = true
      } else {
        const match = line
        const matchOneLine = importStatementToOneLiner(match)
        result.push({ start: l, end: l + 1, match, matchOneLine })
      }
    } else if (isMulti) {
      impLines.push(line)
      if (isLastLineInMulti.test(line)) {
        const match = impLines.join('\n')
        const matchOneLine = importStatementToOneLiner(match)
        result.push({ start: l - impLines.length + 1, end: l + 1, match, matchOneLine })
        impLines = []
        isMulti = false
      }
    }
  }
  return result
}

function replaceImportStatementsInsideLiteralStrings(code: string) {
  return code.replaceAll(/(["'`])(.*?)\1/gs, (match) => {
    return match.replaceAll(/\nimport /gs, '\nIMPORT ')
  })
}

function replaceImportStatementsInsideBlockComments(code: string) {
  return code.replaceAll(/\/\*(.*?)\*\//gs, (match) => {
    return match.replaceAll(/\nimport /gs, '\nIMPORT ')
  })
}

/**
 * Interface representing the result of extracting import statements from TypeScript code.
 * This interface is used to enforce consistent structure when analyzing and manipulating
 * import statements in TypeScript source files.
 */
export type TsExtractImportsResult = {
  /**
   * The line index where the import statement starts (0-indexed).
   */
  start: number
  /**
   * The line index of the last line of the import statement (0-indexed).
   */
  end: number
  /**
   * The complete import statement as it appears in the source code.
   */
  match: string
  /**
   * The import statement converted to a single line format.
   */
  matchOneLine: string
}
