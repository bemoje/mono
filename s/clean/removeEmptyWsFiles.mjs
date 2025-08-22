/**
 * Removes empty files from all workspaces in the monorepo.
 * Scans for files with zero bytes and deletes them to keep the repository clean.
 */
import { getEmptyWsFiles } from '../util/getEmptyWsFiles.mjs'
import fs from 'fs-extra'
import { timer } from '../util/timer.mjs'

await timer(['removeEmptyWsFiles', 'Deleting empty files in all workspaces'], async (log) => {
  const empty = await getEmptyWsFiles()
  for (const file of empty) {
    log.info('Deleting empty file:', file)
    await fs.remove(file)
  }
})
