import { Constructor } from 'type-fest'
import { Any } from './Any'
import { TFunction } from './TFunction'

export type AnyFunction<Ret = Any, Args extends Any[] = Any[]> = Constructor<Ret, Args> | TFunction<Ret, Args>
