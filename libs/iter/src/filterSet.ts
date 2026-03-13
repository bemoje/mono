/**
 * Filter a Set based on a predicate function.
 *
 * @param set - The Set to filter
 * @param predicate - A function that tests each value. Returns `true` to keep the value, `false` otherwise.
 * @returns A new Set containing only the values that satisfy the predicate
 *
 * @example
 * ```ts
 * const set = new Set([1, 2, 3, 4, 5])
 * const evens = filterSet(set, (n) => n % 2 === 0)
 * // evens: Set { 2, 4 }
 * ```
 */
export function filterSet<V, S extends V>(set: ReadonlySet<V>, predicate: (value: V) => value is S): Set<S>
export function filterSet<V>(set: ReadonlySet<V>, predicate: (value: V) => boolean): Set<V>
export function filterSet<V>(set: ReadonlySet<V>, predicate: (value: V) => boolean): Set<V> {
  const result = new Set<V>()
  for (const value of set) {
    if (predicate(value)) {
      result.add(value)
    }
  }
  return result
}
