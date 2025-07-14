import { unwrapDoubleQuotes } from '@mono/string'

/**
 * Takes the first line of a CSV string and returns an array of column names.
 */
export function parseCsvHeaderLine(headerLine: string, delimiter = ';') {
  return headerLine.split(delimiter).map(unwrapDoubleQuotes)
}
