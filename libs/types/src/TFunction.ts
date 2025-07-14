import { Any } from './Any'

export type TFunction<R = Any, A extends Any[] = Any[]> = (...args: A) => R
