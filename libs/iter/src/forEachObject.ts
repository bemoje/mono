import { entriesOf } from '@mono/object/entriesOf'

/**
 * Execute a callback function for each property in an object.
 *
 * @param object - The object to iterate over
 * @param callback - A function to execute for each value-key pair
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 }
 * forEachObject(obj, (value, key) => {
 *   console.log(`${key}: ${value}`)
 * })
 * ```
 */
export function forEachObject<T extends Record<string, unknown>>(
  object: T,
  callback: (value: T[keyof T], key: keyof T) => void
): void {
  for (const [key, value] of entriesOf(object)) {
    callback(value, key)
  }
}
