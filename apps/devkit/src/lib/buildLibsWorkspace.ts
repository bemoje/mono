import upath from 'upath'
import fs from 'fs-extra'
import { buildFile } from './buildFile'
import { buildStats } from './buildStats'
import { getWsPaths } from './getWsPaths'

/**
 * Builds a library workspace from its directory path.
 */
export async function buildLibsWorkspace(
  importMetaDirname: string,
  options: { debug?: boolean } & Record<string, unknown> = {},
) {
  const { debug, ...optionsOverride } = options
  console.info(`Building lib: ${upath.basename(importMetaDirname)}`)
  importMetaDirname = upath.normalizeSafe(importMetaDirname)
  const wsPaths = getWsPaths(importMetaDirname)
  const repoPkg = fs.readJsonSync(wsPaths.pkg)

  await buildFile(
    wsPaths.indexTs,
    (optionsOverride as { format?: string }).format === 'esm' ? wsPaths.indexMjs : wsPaths.indexCjs,
    wsPaths.tsconfig,
    {
      external: [...Object.keys(repoPkg.dependencies || {}), ...Object.keys(repoPkg.devDependencies || {})],
      ...optionsOverride,
    },
  )
  if (debug || process.argv.includes('--debug')) {
    console.debug({
      workspace: wsPaths.toRelative(importMetaDirname),
      tsconfig: wsPaths.toRelative(wsPaths.tsconfig),
      infile: wsPaths.toRelative(wsPaths.indexTs),
      outfile: wsPaths.toRelative(wsPaths.indexCjs),
      stats: await buildStats(wsPaths.indexCjs),
    })
  }
}
