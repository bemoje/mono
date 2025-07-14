import { TStringOfLength } from './TStringOfLength'

/**
 * A type representing a string that has a length of exactly 1.
 */
export type TChar<T extends string> = TStringOfLength<T, 1>
