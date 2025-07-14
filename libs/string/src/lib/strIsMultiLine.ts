/**
 * Checks if a string contains multiple lines.
 * @param string The string to check.
 * @example ```ts
 * strIsMultiLine("Hello\nWorld");
 * //=> true
 * strIsMultiLine("Hello World");
 * //=> false
 * ```
 */
export function strIsMultiLine(string: string): boolean {
  return string.includes('\n')
}
