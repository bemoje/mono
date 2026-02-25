import Table from 'cli-table'
import colors from 'ansi-colors'

/**
 * Formats a 2D array of strings as a terminal table with optional headers and styling.
 */
export function formatTableForTerminal(rows: string[][], headers?: string[], options?: { noBorders?: boolean }) {
  if (!rows.length || !rows[0].length) {
    return ''
  }
  const table = new Table()
  if (headers && headers.length) {
    table.push(
      headers.map((s) => {
        return colors.yellow(s)
      }),
    )
  }
  for (const row of rows) {
    table.push(row)
  }
  if (options?.noBorders) {
    return table
      .toString()
      .replace(/[├┼┤┐┘└┌┬┴│─]/g, '')
      .split('\n')
      .map((line) => {
        return line.trim()
      })
      .filter((line) => {
        return line !== '\x1B[90m\x1B[39m'
      })
      .join('\n')
  } else {
    return table.toString()
  }
}
