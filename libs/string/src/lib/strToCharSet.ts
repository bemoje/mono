/**
 * Converts a string to a set of unique characters.
 * @param string The string to be converted.
 * @example ```ts
 * strToCharSet('hello');
 * //=> Set { 'h', 'e', 'l', 'o' }
 * ```
 */
export function strToCharSet(string: string): Set<string> {
  return new Set(string)
}
