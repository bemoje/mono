/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * @param min The lower bound integer.
 * @param max The upper bound integer.
 * @throws if min is not an integer.
 * @returns A random integer between min and max.
 * @throws if max is not an integer.
 * @example ```ts
 * randomIntBetween(1, 10);
 * //=> {random integer between 1 and 10}
 * ```
 */
export function randomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
