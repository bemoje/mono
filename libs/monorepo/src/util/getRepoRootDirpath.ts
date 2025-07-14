import path from 'upath'
import fs from 'fs-extra'
import onetime from 'onetime'

/**
 * Get the root directory path of the monorepo by finding the package.json with workspaces configuration.
 */
export const getRepoRootDirpath = onetime(function getRepoRootDirpath() {
  return (function recurse(dirpath = process.cwd()) {
    dirpath = path.normalizeSafe(dirpath)
    const pkgpath = path.joinSafe(dirpath, 'package.json')
    if (fs.existsSync(pkgpath) && fs.readJsonSync(pkgpath)?.workspaces) {
      return dirpath
    }
    const parent = path.dirname(dirpath)
    if (parent !== dirpath) return recurse(parent)
    throw new Error('Could not find repo root from process.cwd(): ' + process.cwd())
  })()
})
