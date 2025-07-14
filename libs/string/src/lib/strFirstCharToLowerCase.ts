/**
 * Converts the first character of a string to lowercase.
 * @param string The string to be converted.
 * @example ```ts
 * strFirstCharToLowerCase('Hello');
 * //=> 'hello'
 * ```
 */
export function strFirstCharToLowerCase(string: string): string {
  return string.charAt(0).toLowerCase() + string.substring(1)
}
