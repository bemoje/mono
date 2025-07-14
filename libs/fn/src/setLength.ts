import { defineValue } from '@mono/object'

/**
 * Set the length of a function.
 */
export function setLength<T extends object>(length: number | { length: number }, target: T): T {
  return defineValue(target, 'length', typeof length === 'number' ? length : length.length, { enumerable: false })
}
