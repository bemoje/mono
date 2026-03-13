import { map } from 'iter-tools'

/**
 * Transform the keys in an iterable of key-value pairs using a mapper function.
 *
 * @param mapLike - An iterable of key-value tuples to transform
 * @param mapper - A function that transforms each key
 * @returns An iterable containing entries with transformed keys
 *
 * @example
 * ```ts
 * const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
 * const mapped = mapIterableKeys(entries, (key) => key.toUpperCase())
 * // mapped: Iterable of [['A', 1], ['B', 2], ['C', 3]]
 * ```
 */
export function mapIterableKeys<K, V, K2>(
  mapLike: Iterable<[K, V]>,
  mapper: (key: K, value: V) => K2
): Iterable<[K2, V]> {
  return map(([k, v]: [K, V]) => {
    return [mapper(k, v), v] as [K2, V]
  }, mapLike)
}
