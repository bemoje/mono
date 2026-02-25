import { getAllWorkspacePackageJsons } from './getAllWorkspacePackageJsons'

/**
 * Gets all workspace package names.
 */

export async function getAllWorkspacePackageNames(): Promise<string[]> {
  const pkgs = await getAllWorkspacePackageJsons()
  return pkgs.map((p) => {
    return p.name
  })
}
