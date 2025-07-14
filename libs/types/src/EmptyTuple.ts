import { FixedLengthArray } from 'type-fest'

export type EmptyTuple = readonly [...FixedLengthArray<never, 0>]
