/**
 * Converts a 2D table to a markdown table string.
 */
export function arrayTableToMarkdown(table: string[][]): string {
  if (
    table.length === 0
    || table.some((row) => {
      return row.length !== table[0].length
    })
  ) {
    throw new Error('Invalid table: all rows must have the same number of columns and cannot be empty')
  }

  const columnLengths = table[0].map((_, columnIndex) => {
    return Math.max(
      ...table.map((row) => {
        return row[columnIndex].length
      })
    )
  })

  const padCell = (cell: string, index: number) => {
    return cell.padEnd(columnLengths[index], ' ')
  }

  let md = ''

  md += `| ${table[0].map(padCell).join(' | ')} |\n`
  md += `| ${columnLengths
    .map((length) => {
      return '-'.repeat(length)
    })
    .join(' | ')} |\n`

  for (let i = 1; i < table.length; i++) {
    md += `| ${table[i].map(padCell).join(' | ')} |\n`
  }

  return md.trim()
}
