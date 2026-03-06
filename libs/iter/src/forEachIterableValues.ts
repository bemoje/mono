import { forEach } from 'iter-tools'

/**
 * Execute a callback function for each value in an iterable of key-value pairs.
 *
 * @param mapLike - An iterable of key-value tuples to iterate over
 * @param callback - A function to execute for each value
 *
 * @example
 * ```ts
 * const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
 * forEachIterableValues(entries, (value, key) => {
 *   console.log(`Value: ${value}, Key: ${key}`)
 * })
 * ```
 */
export function forEachIterableValues<K, V>(
  mapLike: Iterable<[K, V]>,
  callback: (value: V, key: K) => void
): void {
  forEach(([k, v]: [K, V]) => {
    callback(v, k)
  }, mapLike)
}
