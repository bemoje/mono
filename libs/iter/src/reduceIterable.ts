/**
 * Reduce any iterable to a single value.
 */
export function reduceIterable<V, T>(
  iterable: Iterable<V>,
  reducer: (accumulator: T, value: V) => T,
  initialValue: T
): T {
  for (const value of iterable) {
    initialValue = reducer(initialValue, value)
  }
  return initialValue
}
