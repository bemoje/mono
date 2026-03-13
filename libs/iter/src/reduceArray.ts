/**
 * Reduce an array to a single value using a reducer function.
 *
 * @param array - The array to reduce
 * @param reducer - A function that combines values
 * @param initial - The initial value for the reduction
 * @returns The reduced value
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * const sum = reduceArray(numbers, (acc, n) => acc + n, 0)
 * // sum: 15
 * ```
 */
export function reduceArray<V, R>(
  array: readonly V[],
  reducer: (accumulator: R, value: V, index: number) => R,
  initial: R
): R {
  let accumulator = initial
  let index = 0
  for (const value of array) {
    accumulator = reducer(accumulator, value, index)
    index++
  }
  return accumulator
}
