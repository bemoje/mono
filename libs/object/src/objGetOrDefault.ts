import { hasOwnProperty } from './hasOwnProperty'

/**
 * Gets a property value from an object or creates it using a factory function if it doesn't exist.
 */
export function objGetOrDefault<K extends PropertyKey, V>(
  object: Record<K, V>,
  key: K,
  factory: (key: K) => V,
): V {
  const value = object[key]
  if (value !== undefined || hasOwnProperty(object, key)) return value
  return (object[key] = factory(key))
}
