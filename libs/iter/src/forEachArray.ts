/**
 * Execute a callback function for each element in an array.
 *
 * @param array - The array to iterate over
 * @param callback - A function to execute for each element
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * forEachArray(numbers, (n, index) => {
 *   console.log(`Item ${index}: ${n}`)
 * })
 * ```
 */
export function forEachArray<V>(array: readonly V[], callback: (value: V, index: number) => void): void {
  let index = 0
  for (const value of array) {
    callback(value, index)
    index++
  }
}
