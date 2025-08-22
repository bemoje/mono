import { GenericMap } from './types'

/**
 * Sorts the map entries using a custom comparison function and updates the map in place.
 * This is Map-specific because it maintains insertion order.
 *
 * @param ins - The map instance to sort
 * @param compare - Function that compares two entries
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
 * sort(map, ([k1], [k2]) => k1.localeCompare(k2))
 * console.log(entriesArray(map)) // [['a', 1], ['b', 2], ['c', 3]]
 * ```
 */
export function sort<K, V>(
  ins: GenericMap<K, V, 'set' | 'clear' | typeof Symbol.iterator>,
  compare: (a: [K, V], b: [K, V]) => number,
): GenericMap<K, V, 'set' | 'clear' | typeof Symbol.iterator> {
  const entries = Array.from(ins).sort(compare)
  ins.clear()
  for (const [k, v] of entries) {
    ins.set(k, v)
  }
  return ins
}
