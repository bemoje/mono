/**
 * Remove double quote from the beginning and end of a string and
 * trims whitespace at the beginning and end of the string
 */
export function unwrapDoubleQuotes(s: string) {
  s = s.trim()
  const result = s.replace(/^"/, '').replace(/"$/, '')
  if (result.length !== s.length - 2) return s
  return result
}
