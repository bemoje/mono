import type { TChar } from '@mono/types'
import type { TDigit } from '@mono/types'

/**
 * Returns true if the given character is a digit between 0 and 9.
 */
export function isDigit<T extends string>(string: TChar<T>): string is TDigit<T> {
  return /^\d$/.test(string)
}
