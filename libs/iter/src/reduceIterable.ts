/**
 * Reduce a map-like iterable to a single value.
 */
export function reduceIterable<K, V, T>(
  mapLike: Iterable<[K, V]>,
  reducer: (accumulator: T, value: V, key: K) => T,
  initialValue: T,
): T {
  for (const [key, value] of mapLike) {
    initialValue = reducer(initialValue, value, key)
  }
  return initialValue
}
