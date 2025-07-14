import { ArraySplice } from 'type-fest'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SetArrayElement<T extends any[], Index extends number, NewElement> = ArraySplice<
  T,
  Index,
  1,
  [NewElement]
>
