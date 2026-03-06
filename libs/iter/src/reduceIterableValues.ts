/**
 * Reduce an iterable of key-value entries based on values using a reducer function.
 *
 * @param mapLike - An iterable of key-value tuples to reduce
 * @param reducer - A function that combines values
 * @param initial - The initial value for the reduction
 * @returns The reduced value
 *
 * @example
 * ```ts
 * const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
 * const sum = reduceIterableValues(entries, (acc, value, key) => acc + value, 0)
 * // sum: 6
 * ```
 */
export function reduceIterableValues<K, V, R>(
  mapLike: Iterable<[K, V]>,
  reducer: (accumulator: R, value: V, key: K) => R,
  initial: R
): R {
  let accumulator = initial
  for (const [k, v] of mapLike) {
    accumulator = reducer(accumulator, v, k)
  }
  return accumulator
}
