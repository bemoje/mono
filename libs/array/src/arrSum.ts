/**
 * Calculates the sum of an array of numbers.
 * @returns The sum of all numbers in the array.
 * @param array The array of numbers to sum.
 * @example ```ts
 * const numbers = [1, 2, 3, 4, 5];
 * arrSum(numbers);
 * //=> 15
 * ```
 */
export function arrSum(array: number[]): number {
  return array.reduce((acc, cur) => acc + cur, 0)
}
