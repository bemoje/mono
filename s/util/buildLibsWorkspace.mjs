/**
 * Builds a library workspace by compiling the index.ts file to a CommonJS module.
 * Used by individual library build scripts to compile their exports.
 */
import { argvHasFlag } from './argvHasFlag.mjs'
import { buildFile } from './buildFile.mjs'
import { buildStats } from './buildStats.mjs'
import { getWsPaths } from './getWsPaths.mjs'
import upath from 'upath'

/**
 * Builds a library workspace from its import.meta.dirname.
 * @param {string} importMetaDirname - The __dirname of the calling script
 */
export async function buildLibsWorkspace(importMetaDirname) {
  console.info(`Building lib: ${upath.basename(importMetaDirname)}`)
  importMetaDirname = upath.normalizeSafe(importMetaDirname)
  const wsPaths = getWsPaths(importMetaDirname)
  await buildFile(wsPaths.indexTs, wsPaths.indexCjs, wsPaths.tsconfig, {})
  if (argvHasFlag('--debug')) {
    console.debug({
      workspace: wsPaths.toRelative(importMetaDirname),
      tsconfig: wsPaths.toRelative(wsPaths.tsconfig),
      infile: wsPaths.toRelative(wsPaths.indexTs),
      outfile: wsPaths.toRelative(wsPaths.indexCjs),
      stats: await buildStats(wsPaths.indexCjs),
    })
  }
}
