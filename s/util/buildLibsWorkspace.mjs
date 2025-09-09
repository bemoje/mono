/**
 * Builds a library workspace by compiling the index.ts file to a CommonJS module.
 * Used by individual library build scripts to compile their exports.
 */
import { argvHasFlag } from './argvHasFlag.mjs'
import { buildFile } from './buildFile.mjs'
import { buildStats } from './buildStats.mjs'
import { getWsPaths } from './getWsPaths.mjs'
import upath from 'upath'
import fs from 'fs-extra'

/**
 * Builds a library workspace from its import.meta.dirname.
 * @param {string} importMetaDirname - The __dirname of the calling script
 */
export async function buildLibsWorkspace(importMetaDirname, optionsOverride = {}) {
  console.info(`Building lib: ${upath.basename(importMetaDirname)}`)
  importMetaDirname = upath.normalizeSafe(importMetaDirname)
  const wsPaths = getWsPaths(importMetaDirname)
  const repoPkg = fs.readJsonSync(wsPaths.pkg)

  await buildFile(
    wsPaths.indexTs,
    optionsOverride.format === 'esm' ? wsPaths.indexMjs : wsPaths.indexCjs,
    wsPaths.tsconfig,
    {
      external: [...Object.keys(repoPkg.dependencies || {}), ...Object.keys(repoPkg.devDependencies || {})],
      ...optionsOverride,
    },
  )
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
