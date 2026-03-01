import type { Logger } from '@mono/cli'
import { MonoRepo } from '@mono/monorepo'

export async function listImportedDependenciesAction(_opts: object, { logger: log }: { logger: Logger }) {
  const repo = new MonoRepo()
  const res = repo.workspaces.map((ws) => {
    return [ws.name, { ...ws.importedDependenciesRecursive, node: [] }]
  }) as [string, { node: string[]; internal: string[]; external: string[] }][]

  new MonoRepo().workspaces.forEach((ws) => {
    const deps = Array.from(
      new Set(
        ws.tsFiles
          .filter((f) => {
            return f.isSourceFile
          })
          .map((f) => {
            return f.tsCode.imports
              .filter((i) => {
                return i.module.isBuiltin
              })
              .map((i) => {
                return i.module.from
              })
          })
          .flat(3)
      )
    )

    const r = res.find(([n]) => {
      return n === ws.name
    })?.[1]
    r?.node.push(...deps)
  })

  res.forEach(([v, c]) => {
    return log.info(`\n${v}:`, c)
  })
}
