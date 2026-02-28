import fs from 'fs-extra'
import { tsconfigBasePathsJsonPath } from '../core/constants/paths'

/**
 * Imports and caches library modules from the monorepo's built artifacts.
 */
export async function importLibs(): Promise<Map<string, Record<string, unknown>>> {
  const paths = (await fs.readJson(tsconfigBasePathsJsonPath)).compilerOptions.paths
  const mod = Object.fromEntries(
    await Promise.all(
      Object.keys(paths)
        .filter((p) => {
          return p.startsWith('@mono/')
        })
        .map(async (ws) => {
          return [ws.split('/')[1], await import(ws)]
        }),
    ),
  )
  const entries = Object.entries(mod) as [string, Record<string, unknown>][]
  return new Map(entries)
}

/**
 * Gets all possible import statements for library exports.
 */
export async function getLibsImportStatements(): Promise<string[]> {
  const map = await importLibs()
  return [...map.entries()].flatMap(([lib, mod]) => {
    return Object.keys(mod)
      .filter((name) => {
        return name !== 'default'
      })
      .map((name) => {
        return `import { ${name} } from '@mono/${lib}'`
      })
  })
}
