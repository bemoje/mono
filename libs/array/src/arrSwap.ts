/**
 * Swaps two elements in an array. This function takes an input array and swaps the elements at the specified indices.
 * @param to The index of the element to swap to.
 * @param from The index of the element to swap from.
 * @template T - The type of elements in the array.
 * @returns The modified array with swapped elements.
 * @throws Will throw an error if 'from' or 'to' is not a valid index in the array.
 * @param input The input array.
 * @example ```ts
 * const arr = [1, 2, 3, 4, 5]
 * arrSwap(arr, 1, 3) //=> [1, 4, 3, 2, 5]
 * ```
 */
export function arrSwap<T>(input: Array<T>, from: number, to: number): Array<T> {
  if (from === to) return input
  ;[input[from], input[to]] = [input[to], input[from]]
  return input
}
