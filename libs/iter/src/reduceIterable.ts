/**
 * Reduce an iterable to a single value using a reducer function.
 *
 * @param collection - The iterable to reduce
 * @param reducer - A function that combines values
 * @param initial - The initial value for the reduction
 * @returns The reduced value
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * const sum = reduceIterable(numbers, (acc, n) => acc + n, 0)
 * // sum: 15
 * ```
 */
export function reduceIterable<T, R>(
  collection: Iterable<T>,
  reducer: (accumulator: R, value: T) => R,
  initial: R
): R {
  let accumulator = initial
  for (const value of collection) {
    accumulator = reducer(accumulator, value)
  }
  return accumulator
}
