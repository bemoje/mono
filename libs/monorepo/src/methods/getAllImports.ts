import { MonoRepo } from '../repo/MonoRepo'

/**
 * Retrieves all import statements from TypeScript source files across all workspaces in the monorepo.
 */
export function getAllImports(repo: MonoRepo) {
  return repo.workspaces.flatMap((ws) => {
    return ws.tsFiles
      .filter((ts) => ts.isSourceFile)
      .flatMap((ts) => {
        return ts.tsCode.imports.flatMap((imp) => {
          return imp
        })
      })
  })
}
