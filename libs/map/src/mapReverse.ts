import { mapLoad } from './mapLoad'
import { GenericMap } from './types'

/**
 * Reverses the order of entries in a Map.
 * @remarks This function creates a new Map with the entries of the original Map in reverse order.
 * The original Map is not modified.
 * @example ```ts
 * mapReverse(new Map([['a', 1], ['b', 2], ['c', 3]]));
 * //=> [['c', 3], ['b', 2], ['a', 1]]
 * ```
 */
export function mapReverse<T extends GenericMap<K, V, 'set' | 'clear' | typeof Symbol.iterator>, K, V>(ins: T): T
export function mapReverse<K, V>(ins: Map<K, V>): Map<K, V>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapReverse<K, V>(ins: GenericMap<K, V, 'set' | 'clear' | typeof Symbol.iterator>): any {
  const entries = Array.from(ins).reverse()
  ins.clear()
  mapLoad(ins, entries)
  return ins
}
