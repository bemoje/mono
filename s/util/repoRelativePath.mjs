import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'

export function repoRelativePath(...filepath) {
  return upath.relative(getRepoRootDirpath(), upath.resolve(upath.joinSafe(...filepath)))
}
