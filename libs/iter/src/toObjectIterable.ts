/**
 * Convert a map-like iterable to a regular object.
 */
export function toObjectIterable<K extends string, V>(mapLike: Iterable<[K, V]>): Record<K, V>
export function toObjectIterable<K, V>(mapLike: Iterable<[K, V]>): Record<Extract<K, string> | string, V>
export function toObjectIterable<K, V>(mapLike: Iterable<[K, V]>) {
  const object = {} as Record<PropertyKey, V>
  for (const [key, value] of mapLike) {
    if (typeof key !== 'string' && typeof key !== 'number' && typeof key !== 'symbol') {
      object[String(key)] = value
    } else {
      object[key] = value
    }
  }
  return object
}
