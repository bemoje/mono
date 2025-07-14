import { Subtract } from 'type-fest'
import { Increment } from './Increment'
import { RemoveArrayElement } from './RemoveArrayElement'

/**
 * Removes elements from an array at specified indices.
 */
export type RemoveArrayElements<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends any[],
  Indices extends number[],
  Offset extends number = 0,
> = Indices extends [infer First extends number, ...infer Rest extends number[]]
  ? RemoveArrayElements<
      RemoveArrayElement<T, Subtract<First, Offset>>,
      Rest,
      Offset extends number ? Increment<Offset> : never
    >
  : T
