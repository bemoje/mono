import type { AnyFunction } from './AnyFunction'

export type NamedFunction = AnyFunction & { name: string }
