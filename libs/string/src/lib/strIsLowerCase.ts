/**
 * Checks if the given string is in lower case.
 * @param input The string to be checked.
 * @example ```ts
 * strIsLowerCase('hello');
 * //=> true
 * strIsLowerCase('Hello');
 * //=> false
 * ```
 */
export function strIsLowerCase(input: string): boolean {
  return input === input.toLowerCase()
}
