import { map } from 'iter-tools'

/**
 * Transform both keys and values of map entries.
 */
export function mapIterable<K, V, U, W>(
  mapLike: Iterable<[K, V]>,
  transform: (value: V, key: K) => [U, W],
): Iterable<[U, W]> {
  return map(([k, v]: [K, V]) => transform(v, k), mapLike)
}
