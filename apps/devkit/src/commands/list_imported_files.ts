import type { Logger } from '@mono/node'
import { countUniques } from '@mono/iter'
import { getAllImports } from "@mono/monorepo";
import { MonoRepo } from "@mono/monorepo";
import { resolveModuleImportPath } from "@mono/monorepo";

export async function listImportedFilesAction(n = '5000', _opts: unknown, { logger: log }: { logger: Logger }) {
  const imports = getAllImports(new MonoRepo())
  const resolved = imports
    .flatMap((i) => {
      const resolvedFileName = resolveModuleImportPath(i.parent.parent.path, i.module.from)?.resolvedFileName
      return i.split().map(() => resolvedFileName)
    })
    .filter((s) => !!s) as string[]
  const res = countUniques(resolved).reverse().entriesArray().slice(0, Number(n))
  res.forEach(([v, c]) => log.info(c, v))
}
