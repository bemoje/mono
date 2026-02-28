/**
 * Reduce a `Map` (or `ReadonlyMap`). Callback receives `(accumulator, value, key)`.
 */
export function reduce<K, V, T>(
  map: ReadonlyMap<K, V>,
  reducer: (accumulator: T, value: V, key: K) => T,
  initialValue: T,
): T

/** Reduce a `Set` (or `ReadonlySet`). Callback receives `(accumulator, value)`. */
export function reduce<V, T>(set: ReadonlySet<V>, reducer: (accumulator: T, value: V) => T, initialValue: T): T

/** Reduce an array. Callback receives `(accumulator, value, index)`. */
export function reduce<V, T>(
  array: readonly V[],
  reducer: (accumulator: T, value: V, index: number) => T,
  initialValue: T,
): T

/** Reduce a plain object. Callback receives `(accumulator, value, key)`. */
export function reduce<K extends string, V, T>(
  object: Record<K, V>,
  reducer: (accumulator: T, value: V, key: K) => T,
  initialValue: T,
): T

/** Reduce any `Iterable`. Callback receives `(accumulator, value)`. */
export function reduce<V, T>(iterable: Iterable<V>, reducer: (accumulator: T, value: V) => T, initialValue: T): T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reduce(target: any, reducer: any, initialValue: any) {
  // Any Iterable
  if (Symbol.iterator in target) {
    // Map - has entries() and is an instance of Map
    if (target instanceof Map) {
      let acc = initialValue
      for (const [key, value] of target.entries()) {
        acc = reducer(acc, value, key)
      }
      return acc
    }
    // Set - has values() and is an instance of Set
    if (target instanceof Set) {
      let acc = initialValue
      for (const value of target.values()) {
        acc = reducer(acc, value)
      }
      return acc
    }
    // Array - use indexed loop so we can pass index to reducer
    if (Array.isArray(target)) {
      let acc = initialValue
      for (let i = 0; i < target.length; i++) {
        acc = reducer(acc, target[i], i)
      }
      return acc
    }

    let acc = initialValue
    for (const value of target) {
      acc = reducer(acc, value)
    }
    return acc
  }
  // Plain object fallback
  let acc = initialValue
  for (const [key, value] of Object.entries(target)) {
    acc = reducer(acc, value, key)
  }
  return acc
}
