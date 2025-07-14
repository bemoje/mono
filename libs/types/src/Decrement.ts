import { Subtract } from 'type-fest'

export type Decrement<T extends number> = Subtract<T, 1>
