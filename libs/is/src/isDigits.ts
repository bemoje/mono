/**
 * Returns true if the given string is a string of digits between 0 and 9.
 */
export function isDigits(string: string): boolean {
  return /^\d+$/.test(string)
}
