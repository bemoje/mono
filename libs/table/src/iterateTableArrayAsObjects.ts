/**
 * Generator that iterates through a 2D table array, yielding objects with header keys and row values.
 */
export function* iterateTableArrayAsObjects<T>(rows: T[][], headers: string[], ignoreHeaders?: Iterable<string>) {
  const ignoreHeadersSet = new Set(ignoreHeaders)
  for (const row of rows) {
    const o: Record<string, T> = {}
    for (const [c, header] of headers.entries()) {
      if (ignoreHeadersSet.has(header)) {
        continue
      }
      o[header] = row[c]
    }
    yield o
  }
}
