/**
 * Generator that iterates through a 2D array table, yielding objects with header keys and row values.
 */
export function* arrTableIterateAsObjects<T>(
  rows: T[][],
  headers: string[],
  ignoreHeaders: Set<string> = new Set()
) {
  if (!headers.length) {
    throw new Error('No headers provided')
  }

  ignoreHeaders.forEach((h) => {
    if (!headers.includes(h)) {
      throw new Error(`Header "${h}" not found in headers: ${headers}`)
    }
  })

  if (new Set(headers).size === ignoreHeaders.size) {
    throw new Error('All headers are ignored')
  }

  for (const [r, row] of rows.entries()) {
    if (row.length !== headers.length) {
      throw new Error(`Row ${r} has ${row.length} columns, but expected ${headers.length}`)
    }

    const o: Record<string, T> = {}
    for (const [c, header] of headers.entries()) {
      if (ignoreHeaders.has(header)) {
        continue
      }
      o[header] = row[c]
    }
    yield o
  }
}
