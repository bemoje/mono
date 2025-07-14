/**
 * Converts the first character of a string to uppercase.
 * @param string The string to be converted.
 * @example ```ts
 * strFirstCharToUpperCase('hello');
 * //=> 'Hello'
 * ```
 */
export function strFirstCharToUpperCase(string: string): string {
  return string.charAt(0).toUpperCase() + string.substring(1)
}
