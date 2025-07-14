import { forEach } from 'iter-tools'

/**
 * Execute a callback function for each entry in a map-like iterable.
 */
export function forEachIterable<K, V>(mapLike: Iterable<[K, V]>, callback: (value: V, key: K) => void): void {
  return forEach(([k, v]: [K, V]) => callback(v, k), mapLike)
}
