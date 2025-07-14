import { reduceIterable } from '@mono/iter'
import { entriesOf } from './entriesOf'
/**
 * Reduces the values of an object into a single value.
 * @param object The object to reduce.
 * @param reducer The function that handles the reduction logic.
 * @param accum The initial value of the accumulator.
 * @param ownKeys A function that returns an iterable of own property (string) keys.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objReduce<A, T extends Record<string, any>>(
  object: T,
  reducer: (accum: A, value: T[keyof T], key: string) => A,
  accum: A,
): A {
  return reduceIterable(entriesOf(object), reducer, accum)
}
