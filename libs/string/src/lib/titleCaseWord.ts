/**
 * Returns first char upper, rest lower. Assumes the given string is a single word.
 */
export function titleCaseWord(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
}
