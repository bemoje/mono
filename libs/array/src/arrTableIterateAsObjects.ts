/**
 * Generator that iterates through a 2D array table, yielding objects with header keys and row values.
 */
export function* arrTableIterateAsObjects<T>(
  rows: T[][],
  headers: string[],
  ignoreHeaders: Set<string> = new Set(),
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

  for (let r = 0; r < rows.length; r++) {
    if (rows[r].length !== headers.length) {
      throw new Error(`Row ${r} has ${rows[r].length} columns, but expected ${headers.length}`)
    }

    const o: Record<string, T> = {}
    for (let c = 0; c < headers.length; c++) {
      if (ignoreHeaders.has(headers[c])) continue
      o[headers[c]] = rows[r][c]
    }
    yield o
  }
}
