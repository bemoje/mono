/**
 * Wraps a string in angle brackets.
 * @param input The string to be wrapped in angle brackets.
 * @example ```ts
 * strWrapInAngleBrackets('example');
 * //=> '<example>'
 * ```
 */
export function strWrapInAngleBrackets(input: string): string {
  return '<' + input + '>'
}
