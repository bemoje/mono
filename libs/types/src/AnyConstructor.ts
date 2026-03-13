import type { Any } from './Any'
import type { AnyFunction } from './AnyFunction'

export type AnyConstructor = (new (...args: any[]) => Any) | AnyFunction
