import type { Logger } from '@mono/node'
import { MonoRepo } from '@mono/monorepo'
import { topImports } from '../lib/topImports'

export async function listTopImportStatementsAction(
  n = '5000',
  _opts: unknown,
  { logger: log }: { logger: Logger },
) {
  const res = topImports(new MonoRepo(), Number(n)).reverse()
  res.forEach((e) => {
    return log.info(e.count, e.code)
  })
}
