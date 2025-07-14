import { GenericMap } from './types'

/**
 * Returns an array of all values in the map.
 * Convenience method that converts the values iterator to an array.
 *
 * @returns Array of all values
 *
 * @example
 * ```typescript
 * const map = new ExtMap<string, number>()
 *   .load([['a', 1], ['b', 2], ['c', 3]])
 *
 * console.log(valuesArray(map)) // [1, 2, 3]
 * ```
 */
export function valuesArray<K, V>(ins: GenericMap<K, V, 'values'>): V[] {
  return Array.from(ins.values())
}
