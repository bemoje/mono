import { arrIndicesOf } from './arrIndicesOf'

/**
 * Removes specified columns from a 2D array table.
 * @param table - The 2D array (table) from which columns will be removed. The first row of the table is assumed to contain column names.
 * @param removeColumnNames - The names of the columns to be removed. These should match the entries in the first row of the table.
 * @returns A new 2D array (table) with the specified columns removed.
 */
export function arrTableRemoveColumns(table: string[][], ...removeColumnNames: string[]): string[][] {
  if (!removeColumnNames.length || !table.length) return table
  const set = new Set(removeColumnNames.map((col) => arrIndicesOf(table[0], col)).flat())
  return table.map((row) => row.filter((_, i) => !set.has(i)))
}
