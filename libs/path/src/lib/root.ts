import upath from 'upath'

/**
 * Returns the root directory of a given path.
 */
export function root(p: string) {
  return upath.parse(p).root
}
