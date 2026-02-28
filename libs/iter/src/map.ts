/**
 * Map a `Map` (or `ReadonlyMap`). Callback receives `(value, key)`. Returns a new `Map`.
 */
export function map<K, V, R>(map: ReadonlyMap<K, V>, transform: (value: V, key: K) => R): Map<K, R>

/** Map a `Set` (or `ReadonlySet`). Callback receives `(value)`. Returns a new `Set`. */
export function map<V, R>(set: ReadonlySet<V>, transform: (value: V) => R): Set<R>

/** Map an array. Callback receives `(value, index)`. Returns a new array. */
export function map<V, R>(array: readonly V[], transform: (value: V, index: number) => R): R[]

/** Map a plain object. Callback receives `(value, key)`. Returns a new object. */
export function map<K extends string, V, R>(object: Record<K, V>, transform: (value: V, key: K) => R): Record<K, R>

/** Map any `Iterable`. Callback receives `(value)`. Returns a new array. */
export function map<V, R>(iterable: Iterable<V>, transform: (value: V) => R): R[]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function map(target: any, transform: any): any {
  if (target instanceof Map) {
    const result = new Map()
    for (const [key, value] of target) {
      result.set(key, transform(value, key))
    }
    return result
  }
  if (target instanceof Set) {
    const result = new Set()
    for (const value of target) {
      result.add(transform(value))
    }
    return result
  }
  if (Array.isArray(target)) {
    return target.map(transform)
  }
  if (Symbol.iterator in target) {
    const result = []
    for (const value of target) {
      result.push(transform(value))
    }
    return result
  }
  // Plain object fallback
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(target)) {
    result[key] = transform(value, key)
  }
  return result
}
