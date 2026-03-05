/**
 * Count the number of lines in a string.
 */
export function stringLineCount(str: string): number {
  let count = 1
  for (const element of str) {
    if (element === '\n') {
      count++
    }
  }
  return count
}
