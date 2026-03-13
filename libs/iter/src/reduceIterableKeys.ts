/**
 * Reduce an iterable of key-value entries based on keys using a reducer function.
 *
 * @param mapLike - An iterable of key-value tuples to reduce
 * @param reducer - A function that combines keys
 * @param initial - The initial value for the reduction
 * @returns The reduced value
 *
 * @example
 * ```ts
 * const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
 * const keys = reduceIterableKeys(entries, (acc, key, value) => acc + key, '')
 * // keys: 'abc'
 * ```
 */
export function reduceIterableKeys<K, V, R>(
  mapLike: Iterable<[K, V]>,
  reducer: (accumulator: R, key: K, value: V) => R,
  initial: R
): R {
  let accumulator = initial
  for (const [k, v] of mapLike) {
    accumulator = reducer(accumulator, k, v)
  }
  return accumulator
}
