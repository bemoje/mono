/**
 * Filter an array based on a predicate function.
 *
 * @param array - The array to filter
 * @param predicate - A function that tests each element. Returns `true` to keep the element, `false` otherwise.
 * @returns A new array containing only the elements that satisfy the predicate
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * const evens = filterArray(numbers, (n) => n % 2 === 0)
 * // evens: [2, 4]
 * ```
 */
export function filterArray<V, S extends V>(
  array: readonly V[],
  predicate: (value: V, index: number) => value is S
): S[]
export function filterArray<V>(array: readonly V[], predicate: (value: V, index: number) => boolean): V[]
export function filterArray<V>(array: readonly V[], predicate: (value: V, index: number) => boolean): V[] {
  let index = 0
  const result: V[] = []
  for (const value of array) {
    if (predicate(value, index)) {
      result.push(value)
    }
    index++
  }
  return result
}
