import { TLengthOfString } from './TLengthOfString'

/**
 * A type representing a string of a specific length.
 */
export type TStringOfLength<S extends string, Length extends number> =
  TLengthOfString<S> extends Length ? S : never
