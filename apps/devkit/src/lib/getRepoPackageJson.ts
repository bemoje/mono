import fs from 'fs-extra'
import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath'

/**
 * Reads the repository's root package.json file.
 */
export async function getRepoPackageJson() {
  return await fs.readJson(getRepoPackageJsonPath())
}

/**
 * Gets the absolute path to the repository's package.json file.
 */
export function getRepoPackageJsonPath(): string {
  return upath.joinSafe(getRepoRootDirpath(), 'package.json')
}
