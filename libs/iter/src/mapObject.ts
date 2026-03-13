import { entriesOf } from '@mono/object/entriesOf'

/**
 * Transform the values in an object using a mapper function.
 *
 * @param object - The object to transform
 * @param mapper - A function that transforms each value
 * @returns A new object containing the transformed values
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 }
 * const doubled = mapObject(obj, (value) => value * 2)
 * // doubled: { a: 2, b: 4, c: 6 }
 * ```
 */
export function mapObject<T extends Record<string, unknown>, R>(
  object: T,
  mapper: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>
  for (const [key, value] of entriesOf(object)) {
    result[key] = mapper(value, key)
  }
  return result
}
