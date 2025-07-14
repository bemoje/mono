import { map } from 'iter-tools'

/**
 * Transform map values while preserving keys.
 */
export function mapIterableValues<K, V, U>(
  mapLike: Iterable<[K, V]>,
  transform: (value: V, key: K) => U,
): Iterable<[K, U]> {
  return map(([k, v]: [K, V]) => [k, transform(v, k)], mapLike)
}
