/**
 * Round a given number to a given nearest whole number.
 * @param integer the number to round.
 * @param nearest the nearest whole number to round to.
 * @returns The rounded number.
 * @throws if any of the arguments are either not finite, NaN or not an integer.
 * @example ```ts
 * roundToNearest(111, 1) //=> 111
 * roundToNearest(111, 10) //=> 110
 * roundToNearest(111, 100) //=> 100
 * roundToNearest(111, 1000) //=> 0
 * roundToNearest(13, 3) //=> 12
 * ```
 */
export function roundToNearest(integer: number, nearest = 1): number {
  return Math.round(integer / nearest) * nearest
}
