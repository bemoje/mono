import { Subtract } from 'type-fest'

export type Increment<T extends number> = Subtract<T, -1>
