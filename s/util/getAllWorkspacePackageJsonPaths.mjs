import { getAllWorkspacePaths } from './getAllWorkspacePaths.mjs'
import path from 'upath'

export async function getAllWorkspacePackageJsonPaths() {
  const paths = await getAllWorkspacePaths()
  return paths.map((p) => {
    return path.join(p, 'package.json')
  })
}
