import { map } from 'iter-tools'

/**
 * Transform values of an iterable.
 */
export function mapIterable<T, R>(set: Iterable<T>, transform: (value: T) => R): Iterable<R> {
  return map((value: T) => {
    return transform(value)
  }, set)
}
