/** @format */
import type { TChar } from './TChar'
import type { TDigits } from './TDigits'

/**
 * A type representing a digit between 0 and 9.
 */
export type TDigit<T extends string> = T extends TDigits ? TChar<T> : never
