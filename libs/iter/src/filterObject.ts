import { entriesOf } from '@mono/object'

/**
 * Filter an object's properties based on a predicate function.
 *
 * @param object - The object to filter
 * @param predicate - A function that tests each value-key pair. Returns `true` to keep the property, `false` otherwise.
 * @returns A new object containing only the properties that satisfy the predicate
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 }
 * const filtered = filterObject(obj, (value) => value > 1)
 * // filtered: { b: 2, c: 3 }
 * ```
 */
export function filterObject<T extends Record<string, unknown>, V2 extends T[keyof T]>(
  object: T,
  predicate: (value: T[keyof T], key: keyof T) => value is V2
): Partial<Record<keyof T, V2>>
export function filterObject<T extends Record<string, unknown>>(
  object: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T>
export function filterObject<T extends Record<string, unknown>>(
  object: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result: Partial<T> = {}
  for (const [key, value] of entriesOf(object)) {
    if (predicate(value, key)) {
      result[key] = value
    }
  }
  return result
}
