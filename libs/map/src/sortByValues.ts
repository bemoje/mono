import { GenericMap } from './types'

/**
 * Sorts the map entries by their values and updates the map in place.
 *
 * @param ins - The map instance to sort
 * @param compare - Function that compares two values
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
 * sortByValues(map, (a, b) => a - b)
 * console.log(entriesArray(map)) // [['a', 1], ['b', 2], ['c', 3]]
 * ```
 */
export function sortByValues<T extends GenericMap<K, V, 'set' | 'clear' | typeof Symbol.iterator>, K, V>(
  ins: T,
  compare: (a: V, b: V) => number,
): T
export function sortByValues<K, V>(
  ins: GenericMap<K, V, 'set' | 'clear' | typeof Symbol.iterator>,
  compare: (a: V, b: V) => number,
): GenericMap<K, V, 'set' | 'clear' | typeof Symbol.iterator>
export function sortByValues<K, V>(
  ins: GenericMap<K, V, 'set' | 'clear' | typeof Symbol.iterator>,
  compare: (a: V, b: V) => number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const entries = Array.from(ins).sort((a, b) => compare(a[1], b[1]))
  ins.clear()
  for (const [k, v] of entries) {
    ins.set(k, v)
  }
  return ins
}
