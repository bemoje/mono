import { map } from 'iter-tools'

/**
 * Transform the values in an iterable of key-value pairs using a mapper function.
 *
 * @param mapLike - An iterable of key-value tuples to transform
 * @param mapper - A function that transforms each value
 * @returns An iterable containing entries with transformed values
 *
 * @example
 * ```ts
 * const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
 * const mapped = mapIterableValues(entries, (value) => value * 2)
 * // mapped: Iterable of [['a', 2], ['b', 4], ['c', 6]]
 * ```
 */
export function mapIterableValues<K, V, V2>(
  mapLike: Iterable<[K, V]>,
  mapper: (value: V, key: K) => V2
): Iterable<[K, V2]> {
  return map(([k, v]: [K, V]) => {
    return [k, mapper(v, k)] as [K, V2]
  }, mapLike)
}
