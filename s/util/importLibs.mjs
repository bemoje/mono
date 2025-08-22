/**
 * Dynamic library importer that loads compiled library modules from the monorepo.
 * Uses onetime to cache imports and avoid redundant module loading.
 */
import fs from 'fs-extra'
import upath from 'upath'
import onetime from 'onetime'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'

/**
 * Imports and caches library modules from the monorepo.
 * @param {string[]} [libDirnames] - Optional array of library directory names to import
 * @returns {Promise<Map<string, object>>} Map of library names to their exported modules
 */
export const importLibs = onetime(async function importLibs(libDirnames) {
  if (!libDirnames) {
    const rootRelativeLibDirpath = upath.relative(getRepoRootDirpath(), 'libs')
    libDirnames = await fs.readdir(rootRelativeLibDirpath)
  }
  const promises = libDirnames.map(async (ws) => {
    const rootRelative = upath.joinSafe(getRepoRootDirpath(), '.dist', 'libs', ws + '.cjs')
    const importRelative = upath.relative(import.meta.dirname, rootRelative)
    return [ws, await import(importRelative)]
  })
  const entries = await Promise.all(promises)
  return new Map(entries)
})
