import { GenericMap } from './types'

/**
 * Gets a value from a map or creates it using a factory function if it doesn't exist.
 */
export function mapGetOrDefault<K, V, T extends GenericMap<K, V, 'get' | 'has' | 'set'>>(
  map: T,
  key: K,
  factory: (key: K, map: T) => V,
): V {
  let value = map.get(key)
  if (value !== undefined || map.has(key)) return value as V
  value = factory(key, map)
  map.set(key, value)
  return value
}
