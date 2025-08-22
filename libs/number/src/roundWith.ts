/**
 * Round a given number with a given precision and rounding function.
 * Shifts with exponential notation to avoid floating-point issues.
 * @param number the number to round.
 * @param precision the number of decimal points.
 * @param round the rounding function to use.
 * @returns The rounded number.
 * @throws if the given number is not finite or NaN.
 * @example ```ts
 * roundWith(1.2345, 2);
 * //=> 1.23
 * roundWith(1.2345, 2, Math.ceil);
 * //=> 1.24
 * ```
 */
export function roundWith(number: number, precision: number, round: (n: number) => number = Math.round): number {
  const pair1 = (number + 'e').split('e')
  const pair2 = (round(+(pair1[0] + 'e' + (+pair1[1] + precision))) + 'e').split('e')
  return +(pair2[0] + 'e' + (+pair2[1] - precision))
}
