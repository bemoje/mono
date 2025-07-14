import { GenericMap } from './types'

/**
 * Loads multiple entries into the map from an iterable.
 *
 * @param entries - An iterable of key-value pairs to load into the map
 * @returns The map instance for method chaining
 */
export function mapLoad<T extends GenericMap<K, V, 'set'>, K, V>(ins: T, entries: Iterable<[K, V]>): T {
  for (const [key, value] of entries) {
    ins.set(key, value)
  }
  return ins
}
