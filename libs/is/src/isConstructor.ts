import type { AnyConstructor } from '@mono/types'

/**
 * Checks if the given value is a valid constructor function.
 */
export function isConstructor(value: unknown): value is AnyConstructor {
  if (typeof value !== 'function') return false
  if (!value.prototype || value.prototype.constructor !== value) return false
  return true
}
