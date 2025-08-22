/**
 * Checks if the provided value is an object type (null and functions included, array not included).
 * @template T - The type of the value to check.
 * @param value The value to check.
 * @returns A boolean indicating whether the provided value is an object type.
 * @example
 * isObject({});
 * //=> true
 * isObject([1]);
 * //=> true
 * isObject(123);
 * //=> false
 */
export function isObjectType(value: unknown): value is object {
  return value != null && typeof value === 'object'
}
