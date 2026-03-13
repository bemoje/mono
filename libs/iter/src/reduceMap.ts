/**
 * Reduce a Map to a single value using a reducer function.
 *
 * @param map - The Map to reduce
 * @param reducer - A function that combines values
 * @param initial - The initial value for the reduction
 * @returns The reduced value
 *
 * @example
 * ```ts
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]])
 * const sum = reduceMap(map, (acc, value, key) => acc + value, 0)
 * // sum: 6
 * ```
 */
export function reduceMap<K, V, R>(
  map: ReadonlyMap<K, V>,
  reducer: (accumulator: R, value: V, key: K) => R,
  initial: R
): R {
  let accumulator = initial
  for (const [key, value] of map) {
    accumulator = reducer(accumulator, value, key)
  }
  return accumulator
}
