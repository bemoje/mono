/**
 * Removes the first and last line from a given string.
 * @param string The string from which the first and last line will be removed.
 * @example ```ts
 * strRemoveFirstAndLastLine('Line1\nLine2\nLine3');
 * //=> 'Line2'
 * ```
 */
export function strRemoveFirstAndLastLine(string: string): string {
  const lines = string.split(/\r?\n/)
  if (lines.length <= 2) return ''
  return lines.slice(1, lines.length - 1).join('\n')
}
