/**
 * Convert a map-like iterable to a regular object.
 */
export function toObjectIterable<K extends string, V>(mapLike: Iterable<[K, V]>) {
  return Object.fromEntries(mapLike) as Record<K, V>
}
