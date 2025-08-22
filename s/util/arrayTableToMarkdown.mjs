/**
 * Converts a 2D table to a markdown table string.
 * @param table A 2D array of strings representing the table.
 * @returns A string representing the table in markdown format.
 */
export function arrayTableToMarkdown(table) {
  if (table.length === 0 || table.some((row) => row.length !== table[0].length)) {
    throw new Error('Invalid table: all rows must have the same number of columns and cannot be empty')
  }

  // Determine the maximum length of the content in each column
  const columnLengths = table[0].map((_, columnIndex) => Math.max(...table.map((row) => row[columnIndex].length)))

  // Function to pad each cell to match the column width
  const padCell = (cell, index) => cell.padEnd(columnLengths[index], ' ')

  let md = ''

  // Add header row
  md += '| ' + table[0].map(padCell).join(' | ') + ' |\n'

  // Add separator row
  md += '| ' + columnLengths.map((length) => '-'.repeat(length)).join(' | ') + ' |\n'

  // Add content rows
  for (let i = 1; i < table.length; i++) {
    md += '| ' + table[i].map(padCell).join(' | ') + ' |\n'
  }

  return md.trim()
}
