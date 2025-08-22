/**
 * Utility to create absolute paths relative to the repository root.
 */
import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'

/**
 * Creates an absolute path by joining the repository root with the provided path segments.
 * @param {...string} filepath - Path segments to join with the repository root
 * @returns {string} The absolute path from the repository root
 */
export function repoAbsolutePath(...filepath) {
  return upath.joinSafe(getRepoRootDirpath(), ...filepath)
}
