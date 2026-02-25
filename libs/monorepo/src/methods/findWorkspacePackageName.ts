import { getAllWorkspacePackageNames } from './getAllWorkspacePackageNames'

/**
 * Finds the full package name for a workspace given a partial name.
 */

export async function findWorkspacePackageName(name: string): Promise<string | undefined> {
  const wsPkgNames = await getAllWorkspacePackageNames()
  return (
    wsPkgNames.find((n) => {
      return n === name
    }) ||
    wsPkgNames.find((n) => {
      return n === `@mono/${name}`
    })
  )
}
