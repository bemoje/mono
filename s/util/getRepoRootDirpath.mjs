/**
 * Utility to find and cache the repository root directory path.
 * Uses onetime to ensure the path is only calculated once.
 */
import upath from 'upath'
import onetime from 'onetime'

/**
 * Gets the repository root directory path.
 * @returns {string} The absolute path to the repository root
 */
export const getRepoRootDirpath = onetime(function () {
  const path = upath.normalizeSafe(import.meta.dirname)
  const parts = path.split('/')
  const repoRootIndex = parts.findLastIndex((part) => part === 'mono')
  if (repoRootIndex === -1) {
    throw new Error('Could not find repo root directory')
  }
  return parts.slice(0, repoRootIndex + 1).join('/')
})
