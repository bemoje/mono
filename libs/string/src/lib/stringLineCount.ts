/**
 * Count the number of lines in a string.
 */
export function stringLineCount(str: string): number {
  let count = 1
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '\n') {
      count++
    }
  }
  return count
}
