/**
 * Returns the last element of an array.
 * Throws an error if the array is empty.
 * @template T The type of elements in the array.
 * @param array The array to get the last element from.
 * @returns The last element of the array.
 * @throws If the array is empty.
 * @example const numbers = [1, 2, 3, 4, 5];
 * const lastNumber = arrLast(numbers);
 * //=> 5
 */
export function arrLast<T>(array: T[]): T {
  if (!array.length) throw new Error('Cannot get last element of empty array.')
  return array[array.length - 1]
}
