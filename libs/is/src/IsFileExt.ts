/**
 * Creates a validator function that checks if a string has the specified file extension (case-insensitive).
 */
export function IsFileExt(ext: string) {
  ext = ext.replace(/^\./, '')
  const regex = new RegExp('\\.' + ext + '$', 'i')
  const func = (v: unknown) => typeof v === 'string' && regex.test(v)
  const name = 'is' + ext.charAt(0).toUpperCase() + ext.substring(1).toLowerCase() + 'FileExt'
  Object.defineProperty(func, 'name', { value: name, configurable: true, writable: true, enumerable: false })
  return func
}
