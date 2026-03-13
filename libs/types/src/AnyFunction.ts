import type { Any } from './Any'
import type { Constructor } from 'type-fest'
import type { TFunction } from './TFunction'

export type AnyFunction<Ret = Any, Args extends Any[] = Any[]> = Constructor<Ret, Args> | TFunction<Ret, Args>
