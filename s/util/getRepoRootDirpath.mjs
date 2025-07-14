import upath from 'upath'
import onetime from 'onetime'

export const getRepoRootDirpath = onetime(function () {
  const path = upath.normalizeSafe(import.meta.dirname)
  const parts = path.split('/')
  const repoRootIndex = parts.findLastIndex((part) => part === 'mono')
  if (repoRootIndex === -1) {
    throw new Error('Could not find repo root directory')
  }
  return parts.slice(0, repoRootIndex + 1).join('/')
})
