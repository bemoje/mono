/**
 * Parses a string into a boolean.
 * @param string The string to parse into a boolean.
 * @example ```ts
 * strParseBoolean('True');
 * //=> true
 * strParseBoolean('False');
 * //=> false
 * ```
 */
export function strParseBoolean(string: string): boolean {
  return string.trim().toLowerCase() === 'true'
}
