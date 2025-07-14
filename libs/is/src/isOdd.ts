/**
 * Checks if a number is odd.
 * @remarks This function will throw an error if the provided value is not an integer.
 * @param n The number to check.
 * @returns A boolean indicating whether the number is odd.
 * @throws Will throw an error if the input is not an integer.
 * @example ```ts
 * isOdd(5);
 * //=> true
 * isOdd(4);
 * //=> false
 * ```
 */
export function isOdd(n: number): boolean {
  return n % 2 !== 0
}
