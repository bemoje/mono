import { forEach as forEachIterTools } from 'iter-tools'

/**
 * Iterate over values of an iterable, executing a callback for each.
 */
export function forEachIterable<T>(set: Iterable<T>, callback: (value: T) => unknown): void {
  return forEachIterTools((value: T) => {
    return callback(value)
  }, set)
}
