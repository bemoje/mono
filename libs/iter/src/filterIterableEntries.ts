import { filter } from 'iter-tools'

/**
 * Filter an iterable of key-value entries based on a predicate function.
 *
 * @param mapLike - An iterable of key-value tuples to filter
 * @param predicate - A function that tests each entry. Returns `true` to keep the entry, `false` otherwise.
 * @returns An iterable containing only the entries that satisfy the predicate
 *
 * @example
 * ```ts
 * const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
 * const filtered = filterIterableEntries(entries, ([key, value]) => value > 1)
 * // filtered: Iterable of [['b', 2], ['c', 3]]
 * ```
 */
export function filterIterableEntries<K, V, K2 extends K, V2 extends V>(
  mapLike: Iterable<[K, V]>,
  predicate: (entry: [K, V]) => entry is [K2, V2]
): Iterable<[K2, V2]>
export function filterIterableEntries<K, V>(
  mapLike: Iterable<[K, V]>,
  predicate: (entry: [K, V]) => boolean
): Iterable<[K, V]>
export function filterIterableEntries<K, V>(
  mapLike: Iterable<[K, V]>,
  predicate: (entry: [K, V]) => boolean
): Iterable<[K, V]> {
  return filter(predicate, mapLike)
}
