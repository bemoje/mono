/**
 * Checks if the provided value is an object (null, arrays and functions not included).
 * @template T - The type of the value to check.
 * @param value The value to check.
 * @returns A boolean indicating whether the provided value is an object.
 * @example ```ts
 * isObject({});
 * //=> true
 * isObject([1]);
 * //=> false
 * isObject(123);
 * //=> false
 * ```
 */
export function isObject(value: unknown): value is object {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}
