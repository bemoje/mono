import { forEach } from 'iter-tools'

/**
 * Execute a callback function for each key in an iterable of key-value pairs.
 *
 * @param mapLike - An iterable of key-value tuples to iterate over
 * @param callback - A function to execute for each key-value pair
 *
 * @example
 * ```ts
 * const entries: [string, number][] = [['apple', 1], ['banana', 2], ['apricot', 3]]
 * forEachIterableKeys(entries, (key, value) => {
 *   console.log(`Key: ${key}, Value: ${value}`)
 * })
 * ```
 */
export function forEachIterableKeys<K, V>(mapLike: Iterable<[K, V]>, callback: (key: K, value: V) => void): void {
  forEach(([k, v]: [K, V]) => {
    callback(k, v)
  }, mapLike)
}
