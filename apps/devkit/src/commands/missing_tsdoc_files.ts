import { timer } from '@mono/node'
import { Command } from 'commander'
import { parseLibsTsDocSummaries } from '../lib/parseLibsTsDocSummaries'

export function missing_tsdoc_files() {
  return new Command('missing-tsdoc-files')
    .description('Validate TSDoc documentation for all library exports.')
    .alias('mtf')
    .action(async () => {
      await timer(['missing-tsdoc-files', 'Checking library exports for missing TSDoc...'], async (log) => {
        const { printLogs, exportsNotInDedicatedFileSet, filesNotDocumented } = await parseLibsTsDocSummaries()
        printLogs(log)
        if (filesNotDocumented.length || exportsNotInDedicatedFileSet.size) {
          log.error('Exiting with code 1.')
          process.exit(1)
        }
      })
    })
}
