/**
 * Filter a `Map` (or `ReadonlyMap`). Predicate receives `(value, key)`. Returns a new `Map`.
 */
export function filter<K, V>(map: ReadonlyMap<K, V>, predicate: (value: V, key: K) => boolean): Map<K, V>

/** Filter a `Set` (or `ReadonlySet`). Predicate receives `(value)`. Returns a new `Set`. */
export function filter<V>(set: ReadonlySet<V>, predicate: (value: V) => boolean): Set<V>

/** Filter an array. Predicate receives `(value, index)`. Returns a new array. */
export function filter<V>(array: readonly V[], predicate: (value: V, index: number) => boolean): V[]

/** Filter a plain object. Predicate receives `(value, key)`. Returns a new partial object. */
export function filter<K extends string, V>(
  object: Record<K, V>,
  predicate: (value: V, key: K) => boolean,
): Partial<Record<K, V>>

/** Filter any `Iterable`. Predicate receives `(value)`. Returns a new array. */
export function filter<V>(iterable: Iterable<V>, predicate: (value: V) => boolean): V[]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filter(target: any, predicate: any): any {
  if (Symbol.iterator in target) {
    if (target instanceof Map) {
      const result = new Map()
      for (const [key, value] of target) {
        if (predicate(value, key)) {
          result.set(key, value)
        }
      }
      return result
    }

    if (target instanceof Set) {
      const result = new Set()
      for (const value of target) {
        if (predicate(value)) {
          result.add(value)
        }
      }
      return result
    }

    if (Array.isArray(target)) {
      return target.filter(predicate)
    }

    const result = []
    for (const value of target) {
      if (predicate(value)) {
        result.push(value)
      }
    }
    return result
  }
  // Plain object fallback
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(target)) {
    if (predicate(value, key)) {
      result[key] = value
    }
  }
  return result
}
