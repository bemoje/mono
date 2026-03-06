import { filter } from 'iter-tools'

/**
 * Filter an iterable based on a predicate function.
 *
 * @param collection - The iterable to filter
 * @param predicate - A function that tests each element. Returns `true` to keep the element, `false` otherwise.
 * @returns An iterable containing only the elements that satisfy the predicate
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * const evens = filterIterable(numbers, (n) => n % 2 === 0)
 * // evens: Iterable of [2, 4]
 * ```
 */
export function filterIterable<T, S extends T>(
  collection: Iterable<T>,
  predicate: (value: T) => value is S
): Iterable<S>
export function filterIterable<T>(collection: Iterable<T>, predicate: (value: T) => boolean): Iterable<T>
export function filterIterable<T>(collection: Iterable<T>, predicate: (value: T) => boolean): Iterable<T> {
  return filter((value: T) => {
    return predicate(value)
  }, collection)
}
