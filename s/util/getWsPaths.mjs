import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'

export function getWsPaths(importMetaDirname) {
  importMetaDirname = upath.normalizeSafe(importMetaDirname)
  const wsDirname = upath.basename(importMetaDirname)
  const tsconfig = upath.joinSafe(importMetaDirname, 'tsconfig.json')
  const srcDir = upath.joinSafe(importMetaDirname, 'src')

  const repoRootDir = getRepoRootDirpath()
  const distDir = upath.joinSafe(repoRootDir, '.dist')
  const indexTs = upath.joinSafe(srcDir, 'index.ts')
  const indexCjs = upath.joinSafe(distDir, wsDirname + '.cjs')
  const toRelative = (path) => upath.relative(repoRootDir, path)
  return {
    wsDir: importMetaDirname,
    wsDirname,
    distDir,
    tsconfig,
    srcDir,
    indexTs,
    indexCjs,
    toRelative,
  }
}

const PATHS = {
  distDir: '.dist',
}
