import { isValidNumber } from './isValidNumber'

/**
 * Checks if a given value is a positive number (including zero).
 */
export function isPositiveNumber(n: unknown): boolean {
  return isValidNumber(n) && n >= 0
}
