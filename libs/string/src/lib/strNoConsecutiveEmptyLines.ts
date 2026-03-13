/**
 * Removes consecutive empty lines from a given string.
 * @param code The string from which to remove consecutive empty lines.
 */
export function strNoConsecutiveEmptyLines(code: string): string {
  return code.replaceAll(/\n\n+/g, '\n\n')
}
