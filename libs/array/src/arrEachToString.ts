/**
 * Coerce each element of an array to string.
 * @template T - The type of elements in the input array.
 * @returns A new array where each element is the string representation of the corresponding element in the input array.
 * @param array The array to iterate over.
 * @example ```ts
 * const numbers = [1, 2, 3];
 * arrEachToString(numbers);
 * //=> ['1', '2', '3']
 * ```
 */
export function arrEachToString<T>(array: T[]): string[] {
  return array.map((element) => '' + element)
}
