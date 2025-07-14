import { roundWith } from './roundWith'

/**
 * Round a given number with a given precision.
 * Shifts with exponential notation to avoid floating-point issues.
 * @param number the number to round.
 * @param precision the number of decimal points.
 * @param - The number of decimal places to round to. Defaults to 0 if not specified.
 * @returns The rounded number.
 * @throws if the given number is not finite or NaN.
 * @example ```ts
 * round(1.2345, 2);
 * //=> 1.23
 * round(1.2345);
 * //=> 1
 * ```
 */
export function round(number: number, precision = 0): number {
  return roundWith(number, precision, Math.round)
}
