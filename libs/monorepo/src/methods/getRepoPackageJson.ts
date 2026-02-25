import fs from 'fs-extra'
import { getRepoPackageJsonPath } from './getRepoPackageJsonPath'

/**
 * Reads the repository's root package.json file.
 */
export async function getRepoPackageJson() {
  return await fs.readJson(getRepoPackageJsonPath())
}
