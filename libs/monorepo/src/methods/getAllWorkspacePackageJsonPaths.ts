import { getAllWorkspacePaths } from './getAllWorkspacePaths'
import upath from 'upath'

/**
 * Gets all workspace package.json file paths.
 */
export async function getAllWorkspacePackageJsonPaths(): Promise<string[]> {
  const paths = await getAllWorkspacePaths()
  return paths.map((p) => {
    return upath.join(p, 'package.json')
  })
}
