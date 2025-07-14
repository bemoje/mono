/**
 * Checks if the provided value is defined (i.e., not `undefined` or `null`).
 * @template T - The type of the value to check.
 * @param value - The value to check. Can be of any type `T`, `undefined`, or `null`.
 * @returns A type guard indicating whether the value is of type `T` (i.e., not `undefined` or `null`).
 */
export function isDefinedValue<T>(value: T | undefined | null): value is NonNullable<T> {
  return value != null
}
