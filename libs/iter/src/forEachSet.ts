/**
 * Execute a callback function for each value in a Set.
 *
 * @param set - The Set to iterate over
 * @param callback - A function to execute for each value
 *
 * @example
 * ```ts
 * const set = new Set([1, 2, 3, 4, 5])
 * forEachSet(set, (n) => {
 *   console.log(n)
 * })
 * ```
 */
export function forEachSet<V>(set: ReadonlySet<V>, callback: (value: V) => void): void {
  for (const value of set) {
    callback(value)
  }
}
