import { isValidNumber } from './isValidNumber'

/**
 * Creates a validator function that checks if a value is a number less than or equal to the specified limit.
 */
export function createLteValidator(limit: number) {
  function func(value: unknown): value is number {
    if (!isValidNumber(value)) return false
    return value <= limit
  }
  Object.defineProperty(func, 'name', {
    configurable: true,
    value: 'isLte' + limit.toString(),
  })
  return func
}
