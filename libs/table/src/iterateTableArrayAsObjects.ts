/**
 * Generator that iterates through a 2D table array, yielding objects with header keys and row values.
 */
export function* iterateTableArrayAsObjects<T>(rows: T[][], headers: string[], ignoreHeaders?: Iterable<string>) {
  const ignoreHeadersSet = new Set(ignoreHeaders)
  for (let r = 0; r < rows.length; r++) {
    const o: Record<string, T> = {}
    for (let c = 0; c < headers.length; c++) {
      if (ignoreHeadersSet.has(headers[c])) continue
      o[headers[c]] = rows[r][c]
    }
    yield o
  }
}
