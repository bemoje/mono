import { forEach } from 'iter-tools'

/**
 * Execute a callback function for each element in an iterable.
 *
 * @param collection - The iterable to iterate over
 * @param callback - A function to execute for each element
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * forEachIterable(numbers, (n) => {
 *   console.log(n)
 * })
 * ```
 */
export function forEachIterable<T>(collection: Iterable<T>, callback: (value: T) => void): void {
  forEach((value: T) => {
    callback(value)
  }, collection)
}
