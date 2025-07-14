import { map } from 'iter-tools'

/**
 * Transform map keys while preserving values.
 */
export function mapIterableKeys<K, V, U>(
  mapLike: Iterable<[K, V]>,
  transform: (key: K, value: V) => U,
): Iterable<[U, V]> {
  return map(([k, v]: [K, V]) => [transform(k, v), v], mapLike)
}
