import { buildFile } from './buildFile'
import { buildStats } from './buildStats'
import { getRepoPackageJson } from './getRepoPackageJson'
import { getWsPaths } from './getWsPaths'
import upath from 'upath'

/**
 * Builds a library workspace from its directory path.
 */
export async function buildLibsWorkspace(
  importMetaDirname: string,
  options: { debug?: boolean } & Record<string, unknown> = {},
) {
  const { debug, ...optionsOverride } = options
  importMetaDirname = upath.normalizeSafe(importMetaDirname)
  const wsPaths = getWsPaths(importMetaDirname)

  const repoPkg = await getRepoPackageJson()
  const external = new Set([
    ...Object.keys(repoPkg.dependencies || {}),
    ...Object.keys(repoPkg.devDependencies || {}),
  ])
  external.delete('onetime')

  await buildFile(
    wsPaths.indexTs,
    (optionsOverride as { format?: string }).format === 'esm' ? wsPaths.indexMjs : wsPaths.indexCjs,
    wsPaths.tsconfig,
    {
      external: Array.from(external),
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
