/**
 * Checks if a given number is a positive integer.
 * @remarks This function uses the `Number.isInteger` method and a simple greater than or equal to zero.
 * @param int The number to check.
 * @returns A boolean indicating whether the input is a positive integer.
 * @example ```ts
 * isPositiveInteger(5); ;
 * //=> true
 * isPositiveInteger(-5);
 * //=> false
 * isPositiveInteger(0); ;
 * //=> true
 * isPositiveInteger(5.5);
 * //=> false
 * ```
 */
export function isPositiveInteger(int: unknown): boolean {
  return typeof int === 'number' && Number.isInteger(int) && int >= 0
}
