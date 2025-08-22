import { isValidNumber } from './isValidNumber'

/**
 * Creates a validator function that checks if a value is a number greater than or equal to the specified limit.
 */
export function createGteValidator(limit: number) {
  function func(value: unknown): value is number {
    if (!isValidNumber(value)) return false
    return value >= limit
  }
  Object.defineProperty(func, 'name', {
    configurable: true,
    value: 'isGte' + limit.toString(),
  })
  return func
}
