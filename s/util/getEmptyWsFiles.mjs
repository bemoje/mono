/**
 * Finds all empty files (0 bytes) in workspace directories.
 * Used by cleanup scripts to identify files that can be safely removed.
 */
import { glob } from 'glob'
import upath from 'upath'

/**
 * Gets an array of paths to empty files in workspaces.
 * @returns {Promise<string[]>} Array of relative paths to empty files
 */
export async function getEmptyWsFiles() {
  return (await glob('{libs,apps}/**/*', { withFileTypes: true, stat: true }))
    .filter((d) => {
      return d.isFile() && d.size === 0
    })
    .map((d) => {
      return upath.relative(process.cwd(), upath.joinSafe(d.parentPath, d.name))
    })
}
