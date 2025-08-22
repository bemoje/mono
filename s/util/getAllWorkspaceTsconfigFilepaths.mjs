/**
 * Gets paths to all tsconfig.json files in workspace directories.
 */
import { globSync } from 'glob'

/**
 * Returns an array of paths to all workspace tsconfig.json files.
 * @returns {string[]} Array of tsconfig.json file paths
 */
export function getAllWorkspaceTsconfigFilepaths() {
  return globSync('{apps,libs,packages}/*/tsconfig.json').map((dp) => './' + dp)
}
