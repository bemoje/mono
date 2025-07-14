/**
 * Convert an array of objects to a table.
 * @param objects - The objects to convert to a table.
 * @param keys - The headers to use for the table. If not provided, the headers will be the union of all keys in the objects and sorted.
 */
export function objectsToTable<T extends object>(objects: T[], keys?: string[]) {
  type K = Exclude<keyof T, number | symbol>
  type V = T[K] | string
  if (!objects.length) return [keys ?? []] as [K, ...V[]][]
  keys =
    keys ??
    (Array.from(
      objects.reduce((set, obj) => {
        Object.keys(obj).forEach((key) => set.add(key as K))
        return set
      }, new Set<K>()),
    ).sort() as K[])

  const rows: V[][] = [keys]
  for (const object of objects) {
    const row: V[] = []
    for (const key of keys) {
      const value = object[key as K]
      if (value == null) row.push('')
      else row.push(value)
    }
    rows.push(row)
  }
  return rows as [K, ...V[]][]
}
