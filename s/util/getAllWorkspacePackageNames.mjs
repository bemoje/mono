import { getAllWorkspacePackageJsons } from './getAllWorkspacePackageJsons.mjs'

export async function getAllWorkspacePackageNames() {
  const pkgs = await getAllWorkspacePackageJsons()
  return pkgs.map((p) => {
    return p.name
  })
}
