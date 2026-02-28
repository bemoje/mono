import { filter } from 'iter-tools'

/**
 * Transform values of an iterable.
 */
export function filterIterable<T>(set: Iterable<T>, predicate: (value: T) => boolean | void): Iterable<T> {
  return filter((value: T) => {
    return !!predicate(value)
  }, set)
}
