import { entriesOf } from './entriesOf'
import { reduceIterableEntries } from '@mono/iter'
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
  return reduceIterableEntries(entriesOf(object), reducer, accum)
}
