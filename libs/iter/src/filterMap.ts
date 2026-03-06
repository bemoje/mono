/**
 * Filter a Map based on a predicate function.
 *
 * @param map - The Map to filter
 * @param predicate - A function that tests each value-key pair. Returns `true` to keep the entry, `false` otherwise.
 * @returns A new Map containing only the entries that satisfy the predicate
 *
 * @example
 * ```ts
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]])
 * const filtered = filterMap(map, (value) => value > 1)
 * // filtered: Map { 'b' => 2, 'c' => 3 }
 * ```
 */
export function filterMap<K, V, V2 extends V>(
  map: ReadonlyMap<K, V>,
  predicate: (value: V, key: K) => value is V2
): Map<K, V2>
export function filterMap<K, V>(map: ReadonlyMap<K, V>, predicate: (value: V, key: K) => boolean): Map<K, V>
export function filterMap<K, V>(map: ReadonlyMap<K, V>, predicate: (value: V, key: K) => boolean): Map<K, V> {
  const result = new Map<K, V>()
  for (const [key, value] of map) {
    if (predicate(value, key)) {
      result.set(key, value)
    }
  }
  return result
}
