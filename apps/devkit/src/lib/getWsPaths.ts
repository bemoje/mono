import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath'

/**
 * Gets workspace-related paths for build operations.
 */
export function getWsPaths(importMetaDirname: string) {
  importMetaDirname = upath.normalizeSafe(importMetaDirname)
  const wsDirname = upath.basename(importMetaDirname)
  const tsconfig = upath.joinSafe(importMetaDirname, 'tsconfig.json')
  const pkg = upath.joinSafe(importMetaDirname, 'package.json')
  const srcDir = upath.joinSafe(importMetaDirname, 'src')

  const repoRootDir = getRepoRootDirpath()
  const distDir = upath.joinSafe(repoRootDir, '.dist', 'libs')
  const indexTs = upath.joinSafe(srcDir, 'index.ts')
  const indexCjs = upath.joinSafe(distDir, wsDirname + '.cjs')
  const indexMjs = upath.joinSafe(distDir, wsDirname + '.mjs')
  const toRelative = (path: string) => upath.relative(repoRootDir, path)
  return {
    wsDir: importMetaDirname,
    wsDirname,
    distDir,
    tsconfig,
    pkg,
    srcDir,
    indexTs,
    indexCjs,
    indexMjs,
    toRelative,
  }
}
