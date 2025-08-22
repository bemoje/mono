/**
 * Counts the number of occurrences of each character in a string and returns a Map where the keys are the characters and the values are their counts.
 * @param string The string to count characters in.
 * @example ```ts
 * strCountChars("hello");
 * //=> Map { 'h' => 1, 'e' => 1, 'l' => 2, 'o' => 1 }
 * ```
 */
export function strCountChars(string: string): Map<string, number> {
  const result = new Map()
  for (const char of string) {
    const count = result.get(char)
    result.set(char, count ? count + 1 : 1)
  }
  return result
}
