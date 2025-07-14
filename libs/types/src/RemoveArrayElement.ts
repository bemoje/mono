import { ArraySplice } from 'type-fest'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RemoveArrayElement<T extends any[], Index extends number> = ArraySplice<T, Index, 1, []>
