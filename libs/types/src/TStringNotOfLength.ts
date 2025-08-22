import { TLengthOfString } from './TLengthOfString'

/**
 * A type representing a string not of a specific length.
 */
export type TStringNotOfLength<S extends string, Length extends number> =
  TLengthOfString<S> extends Length ? never : S
