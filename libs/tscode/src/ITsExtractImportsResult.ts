/**
 * Interface representing the result of extracting import statements from TypeScript code.
 * This interface is used to enforce consistent structure when analyzing and manipulating
 * import statements in TypeScript source files.
 */
export interface ITsExtractImportsResult {
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
