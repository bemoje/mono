/**
 * This function takes an array and a callback function as arguments. It applies the callback function to each element of the array, mutating the original array in the process.
 * @template T The type of elements in the input array.
 * @param input The array to be mapped over.
 * @param f The callback function to be applied to each element of the array. This function takes three arguments: the current element, its index, and the original array.
 * @returns The original array, mutated by the callback function.
 * @example ```ts
 * arrMapMutable([1, 2, 3], (value: number) => value * 2);
 * //=> [2, 4, 6]
 * ```
 */
export function arrMapMutable<T>(input: Array<T>, f: (value: T, index: number, array: T[]) => T): Array<T> {
  for (let i = 0; i < input.length; i++) {
    input[i] = f(input[i], i, input)
  }
  return input
}
