/**
 * Wraps a given string in double quotes.
 * @param input The string to be wrapped in double quotes.
 * @example ```ts
 * strWrapInDoubleQuotes('Hello World');
 * //=> '"Hello World"'
 * ```
 */
export function strWrapInDoubleQuotes(input: string): string {
  return '"' + input + '"'
}
