/**
 * Gets all workspace directory paths in the monorepo.
 * Reads workspace patterns from package.json and resolves them to actual directories.
 */
import { glob } from 'glob'
import { getRepoPackageJson } from './getRepoPackageJson.mjs'
import upath from 'upath'

/**
 * Returns an array of all workspace directory paths.
 * @returns {Promise<string[]>} Array of workspace directory paths
 */
export async function getAllWorkspacePaths() {
  const pkg = await getRepoPackageJson()
  return (await Promise.all(pkg.workspaces.map((pattern) => glob(pattern))))
    .flat()
    .map((fp) => upath.normalizeSafe(fp))
}
