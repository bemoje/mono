/**
 * Transform each value in a Set using a mapper function.
 *
 * @param set - The Set to transform
 * @param mapper - A function that transforms each value
 * @returns A new Set containing the transformed values
 *
 * @example
 * ```ts
 * const set = new Set([1, 2, 3, 4, 5])
 * const doubled = mapSet(set, (n) => n * 2)
 * // doubled: Set { 2, 4, 6, 8, 10 }
 * ```
 */
export function mapSet<V, R>(set: ReadonlySet<V>, mapper: (value: V) => R): Set<R> {
  const result = new Set<R>()
  for (const value of set) {
    result.add(mapper(value))
  }
  return result
}
