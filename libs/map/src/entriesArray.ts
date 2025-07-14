import { GenericMap } from './types'

/**
 * Returns an array of all key-value pairs in the map.
 * Convenience method that converts the entries iterator to an array.
 *
 * @returns Array of all key-value pairs
 *
 * @example
 * ```typescript
 * const map = new ExtMap<string, number>()
 *   .load([['a', 1], ['b', 2], ['c', 3]])
 *
 * console.log(entriesArray(map)) // [['a', 1], ['b', 2], ['c', 3]]
 * ```
 */
export function entriesArray<K, V>(ins: GenericMap<K, V, typeof Symbol.iterator>): [K, V][] {
  return Array.from(ins)
}
