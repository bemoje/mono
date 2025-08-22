import { AnyFunction } from '@mono/types'

/**
 * Checks if the provided value is a named function.
 */
export function isNamedFunction(func: unknown): func is AnyFunction & { name: string } {
  return typeof func === 'function' && !!func.name
}
