import { map } from 'iter-tools'

/**
 * Transform each entry in an iterable of key-value pairs using a mapper function.
 *
 * @param mapLike - An iterable of key-value tuples to transform
 * @param mapper - A function that transforms each entry
 * @returns An iterable containing the transformed entries
 *
 * @example
 * ```ts
 * const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
 * const mapped = mapIterableEntries(entries, ([key, value]) => [key, value * 2])
 * // mapped: Iterable of [['a', 2], ['b', 4], ['c', 6]]
 * ```
 */
export function mapIterableEntries<K, V, K2, V2>(
  mapLike: Iterable<[K, V]>,
  mapper: (entry: [K, V]) => [K2, V2]
): Iterable<[K2, V2]> {
  return map(mapper, mapLike)
}
