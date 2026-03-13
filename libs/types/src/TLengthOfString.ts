/**
 * Type that returns the length of a string.
 * @remarks tail-end recursive approach: returns the type itself to reuse stack of previous call
 */
export type TLengthOfString<S extends string, Acc extends 0[] = []> = S extends `${string}${infer $Rest}`
  ? TLengthOfString<$Rest, [...Acc, 0]>
  : Acc['length']
