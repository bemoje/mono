/**
 * Checks if a given number is a positive non-zero integer.
 */
export function isNonZeroPositiveInteger(int: unknown): boolean {
  return typeof int === 'number' && Number.isInteger(int) && int > 0
}
