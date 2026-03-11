import type { AllKeys } from '@mono/types'

/**
 * Returns an array of all unique object keys found in an array of objects.
 * @template T - The type of values in the input objects.
 * @returns An array of unique keys present in the input objects.
 * @param objects The array of objects.
 * @example ```ts
 * const objects = [
 *   { a: 1, b: 2, d: 4 },
 *   { a: 1, b: 2, c: 3 },
 * ];
 * arrObjectsUniqueKeys(objects);
 * //=> ['a', 'b', 'd', 'c'] // ("a" | "b" | "d" | "c")[]
 * ```
 */
export function arrObjectsUniqueKeys<const T extends object[]>(objects: T) {
  const keys = new Set<string>()
  for (const o of objects) {
    for (const key of Object.keys(o)) {
      keys.add(key)
    }
  }
  return Array.from(keys) as AllKeys<T>
}
