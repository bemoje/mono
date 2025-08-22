/**
 * Checks if the provided value is a valid finite number (not NaN or Infinity).
 */
export function isValidNumber(number: unknown): number is number {
  return typeof number === 'number' && isFinite(number) && !isNaN(number)
}
