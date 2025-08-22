import { getAllWorkspacePackageNames } from './getAllWorkspacePackageNames.mjs'

export async function findWorkspacePackageName(name) {
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
