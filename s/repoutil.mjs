// vitest.config.ts
import { globSync } from 'glob'
import fs from 'fs-extra'
import upath from 'upath'

export function getAllWorkspaceTsconfigFilepaths() {
  return globSync('{apps,libs,packages}/*/tsconfig.json').map((dp) => './' + dp)
}

export function getRepoRootDirpath(dirpath = process.cwd()) {
  if (isRepoRootDirpath(dirpath)) return dirpath
  const parent = upath.dirname(dirpath)
  if (parent !== dirpath) return getRepoRootDirpath(parent)
  throw new Error('Could not find repo root from process.cwd(): ' + process.cwd())
}

export function isRepoRootDirpath(dirpath) {
  return fs.existsSync(upath.join(dirpath, '.yarnrc.yml'))
}
