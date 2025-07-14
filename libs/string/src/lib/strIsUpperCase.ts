/**
 * Checks if the given string is in upper case.
 * @param input The string to be checked.
 * @example ```ts
 * strIsUpperCase('HELLO');
 * //=> true
 * strIsUpperCase('HEllo');
 * //=> false
 * ```
 */
export function strIsUpperCase(input: string): boolean {
  return input === input.toUpperCase()
}
