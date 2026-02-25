import fs from 'fs-extra'
import { getRepoRootDirpath } from './getRepoRootDirpath'
import upath from 'upath'

/**
 * Imports and caches library modules from the monorepo's built artifacts.
 */
export async function importLibs(libDirnames?: string[]): Promise<Map<string, Record<string, unknown>>> {
  if (!libDirnames) {
    const libsDir = upath.joinSafe(getRepoRootDirpath(), 'libs')
    libDirnames = await fs.readdir(libsDir)
  }
  const promises = libDirnames.map(async (ws) => {
    const absPath = upath.joinSafe(getRepoRootDirpath(), '.dist', 'libs', `${ws}.cjs`)
    const currentDir =
      (typeof import.meta !== 'undefined' && import.meta.dirname) ||
      (typeof __dirname !== 'undefined' && __dirname) ||
      process.cwd()
    let importPath = upath.relative(currentDir, absPath)
    if (!importPath.startsWith('.')) {
      importPath = `./${importPath}`
    }
    return [ws, await import(importPath)] as [string, Record<string, unknown>]
  })
  const entries = await Promise.all(promises)
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
