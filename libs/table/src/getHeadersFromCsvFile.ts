import { parseCsvHeaderLine } from './parseCsvHeaderLine'
import { readFileFirstLine } from '@mono/fs'

/**
 * Extracts column headers from the first line of a CSV file.
 */
export async function getHeadersFromCsvFile(filepath: string, delimiter = ';') {
  const firstLine = (await readFileFirstLine(filepath))?.trim()
  if (!firstLine) {
    throw new Error(`No first line found in file: ${filepath}`)
  }
  return parseCsvHeaderLine(firstLine, delimiter)
}
