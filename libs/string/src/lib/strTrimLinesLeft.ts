/**
 * Trims the leading whitespace from each line in a string.
 * @param string The string to trim.
 * @example ```ts
 * strTrimLinesLeft('   line1\n   line2\n   line3');
 * //=> 'line1\nline2\nline3'
 * ```
 */
export function strTrimLinesLeft(string: string): string {
  return string
    .split(/\r?\n/)
    .map((line) => line.trimStart())
    .join('\n')
}
