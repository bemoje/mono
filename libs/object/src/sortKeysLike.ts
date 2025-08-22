/**
 * Sorts the keys of an object in the given order.
 */
export function sortKeysLike<T>(o: T, orderedKeys: (keyof T)[]): T {
  const result = {} as T
  for (const k of orderedKeys) {
    result[k] = o[k]
  }
  return result as T
}
