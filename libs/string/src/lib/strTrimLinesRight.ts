/**
 * Trims trailing whitespace from each line in a string.
 * @param string The string to trim.
 * @example ```ts
 * strTrimLinesRight('  Hello, world!  \n  How are you?  ');
 * //=> '  Hello, world!\n  How are you?'
 * ```
 */
export function strTrimLinesRight(string: string): string {
  return string
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .join('\n')
}
