/**
 * Checks if a number is even.
 * @remarks This function will throw an error if the provided value is not an integer.
 * @param n The number to check.
 * @returns A boolean indicating whether the number is even.
 * @throws Will throw an error if the provided value is not an integer.
 * @example ```ts
 * isEven(2);
 * //=> true
 * isEven(3);
 * //=> false
 * ```
 */
export function isEven(n: number): boolean {
  return n % 2 === 0
}
