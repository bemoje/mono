/**
 * Converts a string to a sorted set of unique characters.
 * @param string The string to be converted.
 * @example ```ts
 * strToSortedCharSet('banana');
 * //=> 'abn'
 * ```
 */
export function strToSortedCharSet(string: string): string {
  return Array.from(new Set(string)).sort().join('')
}
