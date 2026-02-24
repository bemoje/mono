import { Logger } from '@mono/cli'
import { MonoRepo } from '@mono/monorepo'

export async function listImportedBuiltinNodeDependencies(_opts: object, { logger: log }: { logger: Logger }) {
  const withNodeDeps = [] as [string, string[]][]
  const withoutNodeDeps = [] as [string, string[]][]

  new MonoRepo().workspaces.forEach((ws) => {
    const deps = Array.from(
      new Set(
        ws.tsFiles
          .filter((f) => f.isSourceFile)
          .map((f) => {
            return f.tsCode.imports.filter((i) => i.module.isBuiltin).map((i) => i.module.from)
          })
          .flat(3),
      ),
    )

    if (deps.length) {
      withNodeDeps.push([ws.name, deps])
    } else {
      withoutNodeDeps.push([ws.name, deps])
    }
  })

  log.info('Native built-in node dependencies:')
  withNodeDeps.forEach(([name, deps]) => {
    log.log(name + ':', deps)
  })
  withoutNodeDeps.forEach(([name, deps]) => {
    log.log(name + ':', deps)
  })
}
