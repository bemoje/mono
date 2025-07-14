import { Any } from './Any'

export type PredicateFn<Args extends Any[] = Any[]> = (...args: Args) => boolean | void

export type PredicateFnUnstrict<Args extends Any[] = Any[]> = (...args: [...Args, ...Any[]]) => boolean | void
