import { getRepoRootDirpath } from '../util/getRepoRootDirpath'
import upath from 'upath'

/**
 * Gets the absolute path to the repository's package.json file.
 */
export function getRepoPackageJsonPath(): string {
  return upath.joinSafe(getRepoRootDirpath(), 'package.json')
}
