/**
 * Counts the number of occurrences of a specific character in a string.
 * @param input The string to search within.
 * @param char The character to count occurrences of. Must be a single character string of length 1.
 * @throws If the char parameter is not a single character string of length 1.
 * @example ```ts
 * strCountCharOccurances('hello world', 'o');
 * //=> 2
 * ```
 */
export function strCountCharOccurances(input: string, char: string): number {
  if (char.length !== 1) throw new Error('Expected char to be a single character string of length 1.')
  let result = 0
  for (const c of input) {
    if (c === char) result++
  }
  return result
}
