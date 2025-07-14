/**
 * Returns the first element of an iterable object.
 * @template T - The type of elements in the iterable.
 * @param iterable The iterable object.
 * @returns The first element of the iterable object, or `undefined` if the iterable is empty.
 * @example ```ts
 * iterableFirstElement([1, 2, 3, 4, 5]);
 * //=> 1
 * ```
 */
export function iterableFirstElement<T>(iterable: Iterable<T>): T | undefined {
  return iterable[Symbol.iterator]().next().value
}
