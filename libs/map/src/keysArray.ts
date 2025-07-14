import { GenericMap } from './types'

/**
 * Returns an array of all keys in the map.
 * Convenience method that converts the keys iterator to an array.
 *
 * @returns Array of all keys
 *
 * @example
 * ```typescript
 * const map = new ExtMap<string, number>()
 *   .load([['a', 1], ['b', 2], ['c', 3]])
 *
 * console.log(keysArray(map)) // ['a', 'b', 'c']
 * ```
 */
export function keysArray<K, V>(ins: GenericMap<K, V, 'keys'>): K[] {
  return Array.from(ins.keys())
}
