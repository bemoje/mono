import { filter } from 'iter-tools'

/**
 * Filter an iterable of key-value entries based on a predicate function that tests values.
 *
 * @param mapLike - An iterable of key-value tuples to filter
 * @param predicate - A function that tests each value. Returns `true` to keep the entry, `false` otherwise.
 * @returns An iterable containing only the entries whose values satisfy the predicate
 *
 * @example
 * ```ts
 * const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
 * const filtered = filterIterableValues(entries, (value) => value > 1)
 * // filtered: Iterable of [['b', 2], ['c', 3]]
 * ```
 */
export function filterIterableValues<K, V, V2 extends V>(
  mapLike: Iterable<[K, V]>,
  predicate: (value: V, key: K) => value is V2
): Iterable<[K, V2]>
export function filterIterableValues<K, V>(
  mapLike: Iterable<[K, V]>,
  predicate: (value: V, key: K) => boolean
): Iterable<[K, V]>
export function filterIterableValues<K, V>(
  mapLike: Iterable<[K, V]>,
  predicate: (value: V, key: K) => boolean
): Iterable<[K, V]> {
  return filter(([k, v]: [K, V]) => {
    return predicate(v, k)
  }, mapLike)
}
