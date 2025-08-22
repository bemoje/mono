/**
 * Returns an index in the sorted array where the specified value could be inserted while maintaining the sorted order of the array.
 * If the element is already in the array, returns the index after the last instance of the element.
 * @param array - The sorted array to search.
 * @param value - The value to locate in the array.
 * @param comparator - A function that defines the sort order. If omitted, the array elements are converted to strings, then sorted according to each character's Unicode code point value.
 * @returns The index at which the value could be inserted into array to maintain the array's sorted order.
 * @example ```ts
 * const array = [1, 2, 3, 5, 6];
 * const value = 4;
 * const comparator = (a, b) => a - b;
 * const index = arrSortedLowerBound(array, value, comparator);
 * console.log(index); // Output: 3
 * ```
 */
export function arrSortedInsertionIndex<T>(
  array: readonly T[],
  value: T,
  comparator: (a: T, b: T) => number,
): number {
  let first = 0
  let count = array.length
  while (count > 0) {
    const step = Math.trunc(count / 2)
    let it = first + step
    if (comparator(array[it]!, value) <= 0) {
      first = ++it
      count -= step + 1
    } else {
      count = step
    }
  }
  return first
}
