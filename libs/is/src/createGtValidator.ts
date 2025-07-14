import { isValidNumber } from './isValidNumber'

/**
 * Creates a validator function that checks if a value is a number greater than the specified limit.
 */
export function createGtValidator(limit: number) {
  function func(value: unknown): value is number {
    if (!isValidNumber(value)) return false
    return value > limit
  }
  Object.defineProperty(func, 'name', {
    configurable: true,
    value: 'isGt' + limit.toString(),
  })
  return func
}
