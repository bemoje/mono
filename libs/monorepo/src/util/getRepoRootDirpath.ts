import fs from 'fs-extra'
import { memoize } from 'es-toolkit'
import upath from 'upath'

/**
 * Get the root directory path of the monorepo by finding the package.json with workspaces configuration.
 */
export const getRepoRootDirpath = memoize((fspath: string = process.cwd()) => {
  return (function recurse(dirpath: string) {
    dirpath = upath.normalizeSafe(dirpath)
    const pkgpath = upath.joinSafe(dirpath, 'package.json')
    if (fs.existsSync(pkgpath) && !!fs.readJsonSync(pkgpath, { throws: false })?.workspaces?.join('')) {
      return dirpath
    }
    const parent = upath.dirname(dirpath)
    if (parent === dirpath) {
      throw new Error(`Could not find repo root from current dir: ${fspath}`)
    }
    return recurse(parent)
  })(fspath)
})
