import fs from 'fs-extra'
import { getAllWorkspacePackageJsonPaths } from './getAllWorkspacePackageJsonPaths.mjs'

export async function getAllWorkspacePackageJsons() {
  const paths = await getAllWorkspacePackageJsonPaths()
  return paths.map((p) => {
    return fs.readJsonSync(p)
  })
}
