/**
 * Utility to create relative paths from the repository root.
 */
import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'

/**
 * Creates a relative path from the repository root to the provided path.
 * @param {...string} filepath - Path segments to resolve relative to the repository root
 * @returns {string} The relative path from the repository root
 */
export function repoRelativePath(...filepath) {
  return upath.relative(getRepoRootDirpath(), upath.resolve(upath.joinSafe(...filepath)))
}
