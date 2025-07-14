/**
 * Wraps a string in brackets.
 * @param input The string to be wrapped in brackets.
 * @example ```ts
 * strWrapInBrackets('test');
 * //=> '[test]'
 * ```
 */
export function strWrapInBrackets(input: string): string {
  return '[' + input + ']'
}
