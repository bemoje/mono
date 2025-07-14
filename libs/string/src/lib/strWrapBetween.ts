/**
 * Wraps a string between two other strings.
 * @param input The string to be wrapped.
 * @param left The string to be added to the left of the input string.
 * @param right The string to be added to the right of the input string.
 * @example ```ts
 * strWrapBetween('Hello', '<', '>');
 * //=> '<Hello>'
 * ```
 */
export function strWrapBetween(input: string, left: string, right: string): string {
  return left + input + right
}
