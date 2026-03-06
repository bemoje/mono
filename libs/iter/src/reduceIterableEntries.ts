/**
 * Reduce an iterable of key-value entries to a single value using a reducer function.
 *
 * @param mapLike - An iterable of key-value tuples to reduce
 * @param reducer - A function that combines entries
 * @param initial - The initial value for the reduction
 * @returns The reduced value
 *
 * @example
 * ```ts
 * const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
 * const sum = reduceIterableEntries(entries, (acc, [key, value]) => acc + value, 0)
 * // sum: 6
 * ```
 */
export function reduceIterableEntries<K, V, R>(
  mapLike: Iterable<[K, V]>,
  reducer: (accumulator: R, entry: [K, V]) => R,
  initial: R
): R {
  let accumulator = initial
  for (const entry of mapLike) {
    accumulator = reducer(accumulator, entry)
  }
  return accumulator
}
