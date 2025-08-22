/**
 * Remove duplicates from an array
 * @remarks This function uses the JavaScript Set object to remove duplicate values from an array.
 * @typeparam T - The type of elements in the array.
 * @returns The new array with duplicates removed.
 * @param array The array from which to remove duplicates.
 * @example ```ts
 * const array = [1, 2, 2, 3, 4, 4, 5];
 * arrRemoveDuplicates(array);
 * //=> [1, 2, 3, 4, 5]
 * ```
 */
export function arrRemoveDuplicates<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}
