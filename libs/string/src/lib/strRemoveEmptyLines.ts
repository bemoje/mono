/**
 * Removes all empty lines from a given string.
 * @param string The string from which to remove empty lines.
 * @example ```ts
 * strRemoveEmptyLines('Hello\n\nWorld\n\n!');
 * //=> 'Hello\nWorld\n!'
 * ```
 */
export function strRemoveEmptyLines(string: string): string {
  return string
    .split(/\r?\n/)
    .filter((l) => !!l.trim())
    .join('\n')
}
