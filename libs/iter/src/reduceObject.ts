import { entriesOf } from '@mono/object'

/**
 * Reduce an object to a single value using a reducer function.
 *
 * @param object - The object to reduce
 * @param reducer - A function that combines values
 * @param initial - The initial value for the reduction
 * @returns The reduced value
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 }
 * const sum = reduceObject(obj, (acc, value, key) => acc + value, 0)
 * // sum: 6
 * ```
 */
export function reduceObject<T extends Record<string, unknown>, R>(
  object: T,
  reducer: (accumulator: R, value: T[keyof T], key: keyof T) => R,
  initial: R
): R {
  let accumulator = initial
  for (const [key, value] of entriesOf(object)) {
    accumulator = reducer(accumulator, value, key)
  }
  return accumulator
}
