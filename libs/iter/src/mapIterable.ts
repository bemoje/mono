import { map } from 'iter-tools'

/**
 * Transform each element in an iterable using a mapper function.
 *
 * @param collection - The iterable to transform
 * @param mapper - A function that transforms each element
 * @returns An iterable containing the transformed elements
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * const doubled = mapIterable(numbers, (n) => n * 2)
 * // doubled: Iterable of [2, 4, 6, 8, 10]
 * ```
 */
export function mapIterable<T, R>(collection: Iterable<T>, mapper: (value: T) => R): Iterable<R> {
  return map((value: T) => {
    return mapper(value)
  }, collection)
}
