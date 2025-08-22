import { filter } from 'iter-tools'

/**
 * Filter map entries based on a predicate function.
 */
export function filterIterable<K, V>(
  mapLike: Iterable<[K, V]>,
  predicate: (value: V, key: K) => boolean,
): Iterable<[K, V]> {
  return filter(([k, v]: [K, V]) => predicate(v, k), mapLike)
}
