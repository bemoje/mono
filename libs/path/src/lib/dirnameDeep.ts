import upath from 'upath'

/**
 * Returns the absolute path of the parent directory of the given path.
 * @param p the path
 * @param depth how many times to get the parent directory
 * @example dirnameDeep('a/b/c/d', 2) => 'a/b'
 */
export function dirnameDeep(p: string, depth?: number): string {
  const parent = upath.dirname(p)
  return depth && depth > 1 ? dirnameDeep(parent, depth - 1) : parent
}
