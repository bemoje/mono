/**
 * Transform the values in a Map using a mapper function.
 *
 * @param map - The Map to transform
 * @param mapper - A function that transforms each value
 * @returns A new Map containing the transformed values
 *
 * @example
 * ```ts
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]])
 * const doubled = mapMap(map, (value) => value * 2)
 * // doubled: Map { 'a' => 2, 'b' => 4, 'c' => 6 }
 * ```
 */
export function mapMap<K, V, V2>(map: ReadonlyMap<K, V>, mapper: (value: V, key: K) => V2): Map<K, V2> {
  const result = new Map<K, V2>()
  for (const [key, value] of map) {
    result.set(key, mapper(value, key))
  }
  return result
}
