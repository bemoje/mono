import type { Logger } from '@mono/node'
import { getImportsRecursively } from '@mono/monorepo'

export async function listImportsRecursivelyForAction(
  entryPoints: string[],
  _opts: unknown,
  { logger: log }: { logger: Logger }
) {
  const result = await getImportsRecursively(entryPoints)
  log.log(result)
}
