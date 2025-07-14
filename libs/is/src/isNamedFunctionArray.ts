import { isNamedFunction } from './isNamedFunction'

/**
 * Checks if the provided value is an array containing only named functions.
 */
export function isNamedFunctionArray(array: unknown): boolean {
  return Array.isArray(array) && array.every(isNamedFunction)
}
