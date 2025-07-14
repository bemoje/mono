import { isEqual } from 'lodash-es'
import { arrSwap } from './arrSwap'

/**
 * Shuffle items in an array in-place. Guarantees changes.
 * @remarks This function does not guarantee that the order of the elements will be different after shuffling.
 * @typeparam T - The type of the elements in the input array.
 * @returns The same array, but shuffled.
 * @param input The array to shuffle.
 * @example ```ts
 * const input = [1, 2, 3, 4, 5];
 * arrShuffle(input);
 * //=> [3, 1, 5, 2, 4]
 * ```
 */
export function arrShuffle<T>(input: Array<T>): Array<T> {
  if (input.length <= 1) return input
  const original = input.slice()
  let equal = true
  while (equal) {
    for (let i = 0; i < input.length; i++) {
      const newIndex = Math.floor(Math.random() * input.length)
      arrSwap(input, i, newIndex)
    }
    equal = isEqual(input, original)
  }
  return input
}
