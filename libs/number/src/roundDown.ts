import { roundWith } from './roundWith'

/**
 * Round a given number down with a given precision.
 * Shifts with exponential notation to avoid floating-point issues.
 * @param number the number to round.
 * @param precision the number of decimal points.
 * @returns The rounded down number.
 * @throws if the given number is not finite or NaN.
 * @example ```ts
 * roundDown(5.6789, 2);
 * //=> 5.67
 * roundDown(5.6789);
 * //=> 5
 * ```
 */
export function roundDown(number: number, precision = 0): number {
  return roundWith(number, precision, Math.floor)
}
