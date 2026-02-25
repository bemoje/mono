import { Logger } from '@mono/cli'
import { MonoRepo } from '@mono/monorepo'

export async function listImportedDependenciesAction(_opts: object, { logger: log }: { logger: Logger }) {
  const repo = new MonoRepo()
  const res = repo.workspaces.map((ws) => {
    return [ws.name, ws.importedDependenciesRecursive]
  })
  res.forEach(([v, c]) => {
    return log.info(`\n${v}:`, c)
  })
}
