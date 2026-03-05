import path from 'node:path'

/**
 * Whether a path is a relative string, ie. not absolute.
 */
export function isRelative(p: string) {
  return !path.isAbsolute(p)
}
