import { getRepoRootDirpath } from './getRepoRootDirpath'
import upath from 'upath'

/**
 * Gets workspace-related paths for build operations.
 */
export function getWsPaths(importMetaDirname: string) {
  const wsDir = upath.normalizeSafe(importMetaDirname)
  const wsDirname = upath.basename(wsDir)
  const tsconfig = upath.joinSafe(wsDir, 'tsconfig.json')
  const pkg = upath.joinSafe(wsDir, 'package.json')
  const srcDir = upath.joinSafe(wsDir, 'src')

  const repoRootDir = getRepoRootDirpath()
  const distDir = upath.joinSafe(repoRootDir, '.dist', 'libs')
  const indexTs = upath.joinSafe(srcDir, 'index.ts')
  const indexCjs = upath.joinSafe(distDir, `${wsDirname}.cjs`)
  const indexMjs = upath.joinSafe(distDir, `${wsDirname}.mjs`)
  const toRelative = (path: string) => {
    return upath.relative(repoRootDir, path)
  }
  return { wsDir, wsDirname, distDir, tsconfig, pkg, srcDir, indexTs, indexCjs, indexMjs, toRelative }
}
