/**
 * Checks if a given string is numeric.
 */
export function isNumericString(string: string): boolean {
  const trim = string.trim()
  if (!trim) return false
  const n = Number(trim)
  return !isNaN(n) && isFinite(n)
}
