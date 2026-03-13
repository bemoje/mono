import Table from 'cli-table'
import colors from 'ansi-colors'

/**
 * Formats a 2D array of strings as a terminal table with optional headers and styling.
 */
export function formatTableForTerminal(
  rows: string[][],
  headers?: string[],
  options: { noBorders?: boolean } = {}
): string {
  if (!rows.length || !rows[0].length) {
    return ''
  }
  const table = new Table()
  if (headers && headers.length) {
    table.push(
      headers.map((s) => {
        return colors.yellow(s)
      })
    )
  }
  for (const row of rows) {
    table.push(row)
  }
  return options?.noBorders
    ? table
        .toString()
        .replaceAll(/[─│┌┐└┘├┤┬┴┼]/g, '')
        .split('\n')
        .map((line) => {
          return line.trim()
        })
        .filter((line) => {
          return line !== '\u001B[90m\u001B[39m'
        })
        .join('\n')
    : table.toString()
}
