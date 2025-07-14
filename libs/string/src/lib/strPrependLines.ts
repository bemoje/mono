/**
 * Prepend each line of a string with a specified string.
 * @param string - The string to be processed.
 * @param toPrepend - The string to prepend to each line.
 * @returns The processed string with each line prepended by the specified string.
 * @example ```ts
 * const myString = 'Hello\nWorld';
 * strPrependLines(myString, '--');
 * //=> '--Hello\n--World'
 * ```
 */
export function strPrependLines(string: string, toPrepend: string): string {
  return string
    .split(/\r?\n/)
    .map((line) => toPrepend + line)
    .join('\n')
}
