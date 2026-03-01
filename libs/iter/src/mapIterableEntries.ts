import { map } from 'iter-tools'

/**
 * Transform both keys and values of map entries.
 */
export function mapIterableEntries<K, V, U, W>(
  mapLike: Iterable<[K, V]>,
  transform: (value: V, key: K) => [U, W]
): Iterable<[U, W]> {
  return map(([k, v]: [K, V]) => {
    return transform(v, k)
  }, mapLike)
}
