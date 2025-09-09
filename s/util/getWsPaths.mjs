/**
 * Generates standard workspace-related file paths for build scripts.
 * Creates a consistent set of paths for workspace TypeScript configuration, source, and output files.
 */
import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'

/**
 * Gets workspace-related paths for build operations.
 * @param {string} importMetaDirname - The workspace directory path (usually import.meta.dirname)
 * @returns {object} Object containing workspace paths and utility functions
 */
export function getWsPaths(importMetaDirname) {
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
  const toRelative = (path) => upath.relative(repoRootDir, path)
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

const PATHS = {
  distDir: '.dist',
}
