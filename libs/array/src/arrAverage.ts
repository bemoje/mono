import { arrSum } from './arrSum'

/**
 * Calculates the average of an array of numbers.
 * @returns The average of all numbers in the array.
 * @throws an error if the input array is empty.
 * @param array The array of numbers.
 * @example ```ts
 * const numbers = [1, 2, 3, 4, 5];
 * arrAverage(numbers);
 * //=> 3
 * ```
 */
export function arrAverage(array: number[]): number {
  if (!array.length) throw new Error('Cannot take an average of zero values.')
  return arrSum(array) / array.length
}
