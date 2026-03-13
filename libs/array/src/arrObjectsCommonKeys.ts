import type { CommonKeys } from '@mono/types'

/**
 * Returns an array of keys that are common to all objects in the input array.
 * @template T - The type of values in the input objects.
 * @returns An array of keys that are present in all input objects.
 * @param objects The array of objects.
 * @example ```ts
 * const objects = [
 *   { a: 1, b: 2, d: 4 },
 *   { a: 1, b: 2, c: 3 },
 * ];
 * arrObjectsCommonKeys(objects);
 * //=> ['a', 'b'] // ("a" | "b")[]
 * ```
 */
export function arrObjectsCommonKeys<const T extends object[]>(objects: T) {
  const common = new Set<string>(Object.keys(objects[0]))
  for (const o of objects.slice(1)) {
    const keys = Object.keys(o)
    for (const key of common) {
      if (!keys.includes(key)) {
        common.delete(key)
      }
    }
  }
  return Array.from(common) as CommonKeys<T>
}
