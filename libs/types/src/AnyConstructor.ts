import { Any } from './Any'
import { AnyFunction } from './AnyFunction'

export type AnyConstructor = (new (...args: any[]) => Any) | AnyFunction
