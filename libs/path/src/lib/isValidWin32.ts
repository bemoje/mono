/**
 * Check whether a provided windows filesystem path string is valid according to:
 * https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx
 * @param path The path to validate.
 * @throws If the path is invalid and the `assert` option is true.
 */

export function isValidWin32(path: string, options?: { extendedMaxLength?: boolean }): boolean {
  if (path.length === 0) return false
  if (path.indexOf('/') !== -1 && path.indexOf('\\') !== -1) return false
  const maxLength = (options && options.extendedMaxLength ? 32767 : 260) - 12
  if (path.length > maxLength) return false
  const noDriveLetter = /^\w:(\\|\/)/g.test(path) ? path.substring(2) : path
  if (/[<>"|?*:]/g.test(noDriveLetter)) return false
  if (/(\\|\/)(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])((\\|\/)|$)/g.test(path)) return false
  return true
}
