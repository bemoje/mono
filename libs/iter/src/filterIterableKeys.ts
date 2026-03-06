import { filter } from 'iter-tools'

/**
 * Filter an iterable of key-value entries based on a predicate function that tests keys.
 *
 * @param mapLike - An iterable of key-value tuples to filter
 * @param predicate - A function that tests each key-value pair. Returns `true` to keep the entry, `false` otherwise.
 * @returns An iterable containing only the entries whose keys satisfy the predicate
 *
 * @example
 * ```ts
 * const entries: [string, number][] = [['apple', 1], ['banana', 2], ['apricot', 3]]
 * const filtered = filterIterableKeys(entries, (key) => key.startsWith('a'))
 * // filtered: Iterable of [['apple', 1], ['apricot', 3]]
 * ```
 */
export function filterIterableKeys<K, V, K2 extends K>(
  mapLike: Iterable<[K, V]>,
  predicate: (key: K, value: V) => key is K2
): Iterable<[K2, V]>
export function filterIterableKeys<K, V>(
  mapLike: Iterable<[K, V]>,
  predicate: (key: K, value: V) => boolean
): Iterable<[K, V]>
export function filterIterableKeys<K, V>(
  mapLike: Iterable<[K, V]>,
  predicate: (key: K, value: V) => boolean
): Iterable<[K, V]> {
  return filter(([k, v]: [K, V]) => {
    return predicate(k, v)
  }, mapLike)
}
