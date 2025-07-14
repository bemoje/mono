/**
 * Checks if a given number is a negative non-zero integer.
 */
export function isNonZeroNegativeInteger(int: unknown): boolean {
  return typeof int === 'number' && Number.isInteger(int) && int < 0
}
