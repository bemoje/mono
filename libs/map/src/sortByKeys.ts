import { GenericMap } from './types'

/**
 * Sorts the map entries by their keys and updates the map in place.
 *
 * @param ins - The map instance to sort
 * @param compare - Function that compares two keys
 * @returns The map instance for method chaining
 *
 * @example
 * ```typescript
 * const map = new ExtMap<string, number>([
 *   ['c', 3],
 *   ['a', 1],
 *   ['b', 2],
 * ])
 *
 * sortByKeys(map, (a, b) => a.localeCompare(b))
 * console.log(entriesArray(map)) // [['a', 1], ['b', 2], ['c', 3]]
 * ```
 */
export function sortByKeys<K, V>(
  ins: GenericMap<K, V, 'set' | 'clear' | typeof Symbol.iterator>,
  compare: (a: K, b: K) => number,
): GenericMap<K, V, 'set' | 'clear' | typeof Symbol.iterator> {
  const entries = Array.from(ins).sort((a, b) => compare(a[0], b[0]))
  ins.clear()
  for (const [k, v] of entries) {
    ins.set(k, v)
  }
  return ins
}
