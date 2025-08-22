/**
 * Reads and parses the repository's root package.json file.
 */
import fs from 'fs-extra'
import { getRepoPackageJsonPath } from './getRepoPackageJsonPath.mjs'

/**
 * Reads the repository's package.json file.
 * @returns {Promise<object>} The parsed package.json content
 */
export async function getRepoPackageJson() {
  return await fs.readJson(getRepoPackageJsonPath())
}
