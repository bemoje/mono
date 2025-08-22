import { TChar } from '@mono/types'

/**
 * Determines whether a string is a single character.
 */
export function isChar<T extends string>(string: T): string is TChar<T> {
  return string.length === 1
}
