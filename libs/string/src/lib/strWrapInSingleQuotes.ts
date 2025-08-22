/**
 * Wraps a given string in single quotes.
 * @param input The string to be wrapped in single quotes.
 * @example ```ts
 * strWrapInSingleQuotes('Hello World');
 * //=> "'Hello World'"
 * ```
 */
export function strWrapInSingleQuotes(input: string): string {
  return "'" + input + "'"
}
