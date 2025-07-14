import { isValidNumber } from './isValidNumber'

/**
 * Checks if a given value is a positive number (including zero).
 */
export function isPositiveNumber(n: unknown): boolean {
  return typeof n === 'number' && isValidNumber(n) && n >= 0
}
