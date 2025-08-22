import { GenericMap } from './types'

/**
 * Converts a GenericMap to a native Map.
 *
 * @param ins - The GenericMap instance to convert
 * @returns A new native Map with the same entries
 *
 * @example
 * ```typescript
 * const extMap = new ExtMap<string, number>()
 *   .load([['a', 1], ['b', 2], ['c', 3]])
 *
 * const nativeMap = toMap(extMap)
 * console.log(nativeMap instanceof Map) // true
 * ```
 */
export function toMap<K, V>(ins: GenericMap<K, V, typeof Symbol.iterator>): Map<K, V> {
  return new Map(ins)
}
