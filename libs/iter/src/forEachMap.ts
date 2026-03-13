/**
 * Execute a callback function for each entry in a Map.
 *
 * @param map - The Map to iterate over
 * @param callback - A function to execute for each value-key pair
 *
 * @example
 * ```ts
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]])
 * forEachMap(map, (value, key) => {
 *   console.log(`${key}: ${value}`)
 * })
 * ```
 */
export function forEachMap<K, V>(map: ReadonlyMap<K, V>, callback: (value: V, key: K) => void): void {
  for (const [key, value] of map) {
    callback(value, key)
  }
}
