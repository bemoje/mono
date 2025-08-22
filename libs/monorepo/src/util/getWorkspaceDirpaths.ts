import { PackageJson } from '@mono/types'
import fs from 'fs-extra'
import { globSync } from 'glob'
import path from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath'

/**
 * Get all workspace directory paths by reading the workspace patterns from the root package.json.
 */
export function getWorkspaceDirpaths(): string[] {
  const rootDirpath = getRepoRootDirpath()
  const pkg = fs.readJsonSync(path.joinSafe(rootDirpath, 'package.json')) as PackageJson
  if (!pkg.workspaces) {
    throw new Error(`No workspaces found in package.json at ${rootDirpath}`)
  }
  return pkg.workspaces.flatMap((workspace: string) => globSync(workspace)).map(path.normalizeSafe)
}
