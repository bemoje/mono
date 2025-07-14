import { Primitive } from 'type-fest'

/**
 * Checks if the provided value is a primitive type (null, undefined, bigint, boolean, number, string or symbol).
 * @param value The value to check.
 * @returns A boolean indicating whether the provided value is a primitive type.
 * @example
 * isPrimitive(123);
 * //=> true
 * isPrimitive({});
 * //=> false
 */
export function isPrimitive(value: unknown): value is Primitive {
  if (typeof value === 'object') {
    return value === null
  }
  return typeof value !== 'function'
}
