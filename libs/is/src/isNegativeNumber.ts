import { isValidNumber } from './isValidNumber'

/**
 * Checks if a given number is negative or zero.
 */
export function isNegativeNumber(n: unknown): boolean {
  return isValidNumber(n) && n <= 0
}
