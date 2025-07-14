import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'

export function repoAbsolutePath(...filepath) {
  return upath.joinSafe(getRepoRootDirpath(), ...filepath)
}
