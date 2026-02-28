import { arrEachToString } from './arrEachToString'

/**
 * Coerce each value of a 2D array table to string.
 * @template T - The type of the elements in the input array.
 * @returns The converted 2D array where each element is a string.
 * @param table The 2D array to convert.
 * @example ```ts
 * const input: number[][] = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
 * arrTableEachToString(input);
 * //=> [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']]
 * ```
 */
export function arrTableEachToString<T>(table: T[][]): string[][] {
  return table.map(arrEachToString)
}
