/**
 * Reduce a Set to a single value using a reducer function.
 *
 * @param set - The Set to reduce
 * @param reducer - A function that combines values
 * @param initial - The initial value for the reduction
 * @returns The reduced value
 *
 * @example
 * ```ts
 * const set = new Set([1, 2, 3, 4, 5])
 * const sum = reduceSet(set, (acc, n) => acc + n, 0)
 * // sum: 15
 * ```
 */
export function reduceSet<V, R>(set: ReadonlySet<V>, reducer: (accumulator: R, value: V) => R, initial: R): R {
  let accumulator = initial
  for (const value of set) {
    accumulator = reducer(accumulator, value)
  }
  return accumulator
}
