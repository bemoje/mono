/**
 * Wraps a given string with another string.
 * @param input The string to be wrapped.
 * @param wrap The string to wrap around the input.
 * @example ```ts
 * strWrapIn('hello', '*');
 * //=> '*hello*'
 * ```
 */
export function strWrapIn(input: string, wrap: string): string {
  return wrap + input + wrap
}
