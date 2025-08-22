import { isValidNumber } from './isValidNumber'

/**
 * Checks if a given value is a negative number less than zero.
 */
export function isNonZeroNegativeNumber(n: unknown): boolean {
  return typeof n === 'number' && isValidNumber(n) && n < 0
}
