/**
 * Ensures win32 backslashes are used instead of forward slashes.
 */
export function toWin32(p: string) {
  return p.replace(/\//g, '\\')
}
