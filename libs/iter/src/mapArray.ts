/**
 * Transform each element in an array using a mapper function.
 *
 * @param array - The array to transform
 * @param mapper - A function that transforms each element
 * @returns A new array containing the transformed elements
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * const doubled = mapArray(numbers, (n) => n * 2)
 * // doubled: [2, 4, 6, 8, 10]
 * ```
 */
export function mapArray<V, R>(array: readonly V[], mapper: (value: V, index: number) => R): R[] {
  let index = 0
  const result: R[] = []
  for (const value of array) {
    result.push(mapper(value, index))
    index++
  }
  return result
}
