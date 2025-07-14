/**
 * Replaces all occurrences of more than two consecutive empty lines with two empty lines.
 */
export function strMaxTwoConsecutiveEmptyLines(string: string): string {
  return string.replace(/(\r?\n){4,}/g, '\n\n\n')
}
