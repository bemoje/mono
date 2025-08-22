/**
 * Sorts an array of numbers, bigints, or booleans in ascending order.
 * @returns The sorted array.
 * @remarks This function uses the JavaScript `Array.prototype.sort()` method, which sorts elements in place.
 * Therefore, the original array will be modified.
 * @throws If any element in the input array is not a number, bigint, or boolean.
 * @param input The array to be sorted.
 * @example ```ts
 * const input = [5, 2n, true, 10, false];
 * arrSortNumeric(input);
 * //=> [false, true, 2n, 5, 10]
 * ```
 */
export function arrSortNumeric(input: Array<number | bigint | boolean>): Array<number | bigint | boolean> {
  return input.sort((a: number | bigint | boolean, b: number | bigint | boolean) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  })
}
