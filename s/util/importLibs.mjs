import fs from 'fs-extra'
import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'

export async function importLibs(libDirnames) {
  if (!libDirnames) {
    const rootRelativeLibDirpath = upath.relative(getRepoRootDirpath(), 'libs')
    libDirnames = await fs.readdir(rootRelativeLibDirpath)
  }
  const promises = libDirnames.map(async (ws) => {
    const rootRelative = upath.joinSafe(getRepoRootDirpath(), '.dist', ws + '.cjs')
    const importRelative = upath.relative(import.meta.dirname, rootRelative)
    return [ws, await import(importRelative)]
  })
  const entries = await Promise.all(promises)
  return new Map(entries)
}
