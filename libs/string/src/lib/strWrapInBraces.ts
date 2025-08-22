/**
 * Wraps a given string in braces.
 * @param input The string to be wrapped in braces.
 * @example ```ts
 * strWrapInBraces('hello');
 * //=> "{hello}"
 * ```
 */
export function strWrapInBraces(input: string): string {
  return '{' + input + '}'
}
