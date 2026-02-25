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
