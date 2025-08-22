/**
 * Returns true if the string ends with an incomplete UTF-16 surrogate pair.
 * This is useful for determining if a string can be safely concatenated with another string.
 */
export function endsWithIncompleteUtfPairSurrogate(string: string): boolean {
  if (string.length === 0) return false
  const HIGH_SURROGATE_START = 55_296
  const HIGH_SURROGATE_END = 56_319
  // Check if the last character is a high surrogate
  const lastCharCode = string.charCodeAt(string.length - 1)
  return lastCharCode >= HIGH_SURROGATE_START && lastCharCode <= HIGH_SURROGATE_END
}
