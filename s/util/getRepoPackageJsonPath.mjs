/**
 * Utility to get the path to the repository's root package.json file.
 */
import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'

/**
 * Gets the absolute path to the repository's package.json file.
 * @returns {string} The absolute path to package.json
 */
export function getRepoPackageJsonPath() {
  return upath.joinSafe(getRepoRootDirpath(), 'package.json')
}
