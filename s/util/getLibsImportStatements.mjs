/**
 * Generates import statements for all exported functions and classes in the libs directory.
 * Useful for documentation and discovering available functionality.
 */
import { importLibs } from './importLibs.mjs'

/**
 * Gets all possible import statements for library exports.
 * @returns {Promise<string[]>} Array of import statement strings
 */
export async function getLibsImportStatements() {
  const map = await importLibs()

  return [...map.entries()].flatMap(([lib, mod]) => {
    return Object.keys(mod)
      .filter((name) => name !== 'default')
      .map((name) => {
        return `import { ${name} } from '@mono/${lib}'`
      })
  })
}
