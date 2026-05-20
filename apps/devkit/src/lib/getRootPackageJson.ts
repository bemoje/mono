import fs from 'fs-extra'
import { getRootPackageJsonPath } from './getRootPackageJsonPath'

/**
 * Reads the repository's root package.json file.
 */
export async function getRootPackageJson() {
  return await fs.readJson(getRootPackageJsonPath())
}
