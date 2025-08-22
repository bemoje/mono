/**
 * Trims leading and trailing whitespace from each line in a string.
 * @param string The string to trim.
 * @example ```ts
 * strTrimLines('  Hello, world!  \n  How are you?  ');
 * //=> 'Hello, world!\nHow are you?'
 * ```
 */
export function strTrimLines(string: string): string {
  return string
    .split(/\r?\n/)
    .map((line) => line.trim())
    .join('\n')
}
