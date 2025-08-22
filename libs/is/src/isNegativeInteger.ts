/**
 * Checks if a given number is a negative integer.
 * @remarks This function uses the `Number.isInteger` method to check if the input is an integer, and then checks if it is less than or equal to 0.
 * @param int The number to check.
 * @returns A boolean indicating whether the input is a negative integer.
 * @example ```ts
 * isNegativeInteger(-5); ;
 * //=> true
 * isNegativeInteger(0);  ;
 * //=> true
 * isNegativeInteger(5);  ;
 * //=> false
 * ```
 */
export function isNegativeInteger(int: unknown): boolean {
  return typeof int === 'number' && Number.isInteger(int) && int <= 0
}
