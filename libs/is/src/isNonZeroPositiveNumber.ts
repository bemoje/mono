import { isValidNumber } from './isValidNumber'

/**
 * Checks if a given value is a positive number greater than zero.
 */
export function isNonZeroPositiveNumber(n: unknown): boolean {
  return typeof n === 'number' && isValidNumber(n) && n > 0
}
