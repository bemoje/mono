import type { GenericMap } from '@mono/types'

/**
 * Updates a value in the map using an update function.
 *
 * @param key - The key to update
 * @param update - Function that receives the current value and returns the new value
 * @returns The map instance for method chaining
 */
export function mapUpdate<T extends GenericMap<K, V, 'set' | 'get'>, K, V>(
  ins: T,
  key: K,
  update: (value: V | undefined, key: K, map: T) => V,
): T
export function mapUpdate<K, V>(
  ins: Map<K, V>,
  key: K,
  update: (value: V | undefined, key: K, map: Map<K, V>) => V,
): typeof ins
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapUpdate<K, V>(ins: any, key: K, update: (value: V | undefined, key: K, map: any) => V) {
  const newValue = update(ins.get(key), key, ins)

  ins.set(key, newValue)
  return ins
}
