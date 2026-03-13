import type { Logger } from '@mono/node'
import { parseLibsTsDocSummaries } from '../lib/parseLibsTsDocSummaries'

export async function missingTsdocFilesAction(_opts: unknown, { logger: log }: { logger: Logger }) {
  const { printLogs, exportsNotInDedicatedFileSet, filesNotDocumented } = await parseLibsTsDocSummaries()
  printLogs(log)
  if (filesNotDocumented.length || exportsNotInDedicatedFileSet.size) {
    log.error('Exiting with code 1.')
    process.exit(1)
  }
}
