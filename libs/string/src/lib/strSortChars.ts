/**
 * Sorts the characters in a string in alphabetical order.
 * @param string The string to sort.
 * @example ```ts
 * strSortChars('dcba');
 * //=> 'abcd'
 * ```
 */
export function strSortChars(string: string): string {
  return Array.from(string).sort().join('')
}
