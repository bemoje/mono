import { getRepoRootDirpath } from './getRepoRootDirpath'
import upath from 'upath'

/**
 * Gets the absolute path to the repository's package.json file.
 */
export function getRootPackageJsonPath(): string {
  return upath.joinSafe(getRepoRootDirpath(), 'package.json')
}
