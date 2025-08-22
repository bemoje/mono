import { TStringNotOfLength } from './TStringNotOfLength'

/**
 * A type representing a string of length >= 1
 */
export type TNonEmptyString<S extends string = string> = TStringNotOfLength<S, 1>
