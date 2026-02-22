import { Command } from 'commander'
import fs from 'fs-extra'
import { timer } from '@mono/node'
import { getEmptyWsFiles } from '../lib/getEmptyWsFiles'

export function fix_empty_files() {
  return new Command('fix-empty-files') //
    .alias('fef')
    .description('Remove empty files from all workspaces.')
    .action(async () => {
      await timer('fix-empty-files', async (log) => {
        const empty = await getEmptyWsFiles()
        for (const file of empty) {
          log.info('Deleting empty file:', file)
          await fs.remove(file)
        }
      })
    })
}
