/**
 * Checks if the provided value is null.
 */
export function isNull(value: unknown): value is null {
  return value === null
}
