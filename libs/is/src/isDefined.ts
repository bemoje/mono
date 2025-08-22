/**
 * This function checks if a value is defined or not.
 * It performs a strict comparison against `undefined`.
 * @template T - The type of the value to check.
 * @param value - The value to check if it is defined.
 * @returns A type guard indicating whether the value is defined.
 */
export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
}
