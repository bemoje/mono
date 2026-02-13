import { glob } from 'glob'
import fs from 'fs-extra'
import upath from 'upath'
import { getRepoPackageJson } from './getRepoPackageJson'

/**
 * Returns an array of all workspace directory paths.
 */
export async function getAllWorkspacePaths(): Promise<string[]> {
  const pkg = await getRepoPackageJson()
  return (await Promise.all(pkg.workspaces.map((pattern: string) => glob(pattern))))
    .flat()
    .map((fp) => upath.normalizeSafe(fp))
}

/**
 * Gets all workspace package.json file paths.
 */
export async function getAllWorkspacePackageJsonPaths(): Promise<string[]> {
  const paths = await getAllWorkspacePaths()
  return paths.map((p) => upath.join(p, 'package.json'))
}

/**
 * Gets all workspace package.json contents.
 */
export async function getAllWorkspacePackageJsons() {
  const paths = await getAllWorkspacePackageJsonPaths()
  return paths.map((p) => fs.readJsonSync(p))
}

/**
 * Gets all workspace package names.
 */
export async function getAllWorkspacePackageNames(): Promise<string[]> {
  const pkgs = await getAllWorkspacePackageJsons()
  return pkgs.map((p) => p.name)
}

/**
 * Finds the full package name for a workspace given a partial name.
 */
export async function findWorkspacePackageName(name: string): Promise<string | undefined> {
  const wsPkgNames = await getAllWorkspacePackageNames()
  return wsPkgNames.find((n) => n === name) || wsPkgNames.find((n) => n === `@mono/${name}`)
}
