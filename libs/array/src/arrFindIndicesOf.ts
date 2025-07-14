/**
 * Returns an array of indices where the predicate function returns true for the corresponding element in the input array.
 * @param input - The array to search.
 * @param predicate - The function to test each element of the array.
 * @returns An array of indices where the predicate function returns true.
 */
export function arrFindIndicesOf<T>(input: Array<T>, predicate: (value: T) => boolean): number[] {
  const result: number[] = []
  for (let i = 0; i < input.length; i++) {
    if (predicate(input[i])) {
      result.push(i)
    }
  }
  return result
}
