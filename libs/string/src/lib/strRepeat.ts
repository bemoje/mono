/**
 * Repeats the given string `n` times.
 * @param input The string to repeat.
 * @param n The number of times to repeat the string.
 * @example ```ts
 * strRepeat('abc', 3);
 * //=> 'abcabcabc'
 * ```
 */
export function strRepeat(input: string, n: number): string {
  return new Array(n).fill(input).join('')
}
