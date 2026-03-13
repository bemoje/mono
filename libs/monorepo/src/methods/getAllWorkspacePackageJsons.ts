import fs from 'fs-extra'
import { getAllWorkspacePackageJsonPaths } from './getAllWorkspacePackageJsonPaths'

/**
 * Gets all workspace package.json contents.
 */
export async function getAllWorkspacePackageJsons() {
  const paths = await getAllWorkspacePackageJsonPaths()
  return paths.map((p) => {
    return fs.readJsonSync(p)
  })
}
