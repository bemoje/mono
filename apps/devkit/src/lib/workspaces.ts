import fs from 'fs-extra'
import { getRepoPackageJson } from './getRepoPackageJson'
import { glob } from 'glob'
import upath from 'upath'

/**
 * Returns an array of all workspace directory paths.
 */
export async function getAllWorkspacePaths(): Promise<string[]> {
  const pkg = await getRepoPackageJson()
  return (
    await Promise.all(
      pkg.workspaces.map((pattern: string) => {
        return glob(pattern)
      }),
    )
  )
    .flat()
    .map((fp) => {
      return upath.normalizeSafe(fp)
    })
}

/**
 * Gets all workspace package.json file paths.
 */
export async function getAllWorkspacePackageJsonPaths(): Promise<string[]> {
  const paths = await getAllWorkspacePaths()
  return paths.map((p) => {
    return upath.join(p, 'package.json')
  })
}

/**
 * Gets all workspace package.json contents.
 */
export async function getAllWorkspacePackageJsons() {
  const paths = await getAllWorkspacePackageJsonPaths()
  return paths.map((p) => {
    return fs.readJsonSync(p)
  })
}

/**
 * Gets all workspace package names.
 */
export async function getAllWorkspacePackageNames(): Promise<string[]> {
  const pkgs = await getAllWorkspacePackageJsons()
  return pkgs.map((p) => {
    return p.name
  })
}

/**
 * Finds the full package name for a workspace given a partial name.
 */
export async function findWorkspacePackageName(name: string): Promise<string | undefined> {
  const wsPkgNames = await getAllWorkspacePackageNames()
  return (
    wsPkgNames.find((n) => {
      return n === name
    }) ||
    wsPkgNames.find((n) => {
      return n === `@mono/${name}`
    })
  )
}
