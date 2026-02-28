import { round as _round } from 'es-toolkit'

/**
 * Round a number to a specified number of decimal places.
 * @param num The number to round.
 * @param decimalPlaces The number of decimal places to round to (default is 0).
 * @returns The rounded number.
 * @example ```ts
 * round(3.14159, 2);
 * //=> 3.14
 * round(3.14159);
 * //=> 3
 * round(3.14159, 4);
 * //=> 3.1416
 * ```
 */
export const round = _round
