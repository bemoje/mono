import { AnyFunction } from './AnyFunction'
import { Any } from './Any'

export type AnyConstructor = (new (...args: any[]) => Any) | AnyFunction
