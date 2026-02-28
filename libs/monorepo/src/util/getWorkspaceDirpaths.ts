import type { PackageJson } from '@mono/types'
import fs from 'fs-extra'
import { getRepoRootDirpath } from './getRepoRootDirpath'
import { globSync } from 'glob'
import path from 'upath'

/**
 * Get all workspace directory paths by reading the workspace patterns from the root package.json.
 */
export function getWorkspaceDirpaths(): string[] {
  const rootDirpath = getRepoRootDirpath()
  const pkg = fs.readJsonSync(path.joinSafe(rootDirpath, 'package.json')) as PackageJson
  if (!pkg.workspaces) {
    throw new Error(`No workspaces found in package.json at ${rootDirpath}`)
  }
  return pkg.workspaces
    .flatMap((workspace: string) => {
      return globSync(workspace)
    })
    .map(path.normalizeSafe)
}
