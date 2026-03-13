import type { Logger } from '@mono/node'
import fs from 'fs-extra'
import { getEmptyWsFiles } from '../lib/getEmptyWsFiles'

export async function fixEmptyFilesAction(_opts: unknown, { logger: log }: { logger: Logger }) {
  const empty = await getEmptyWsFiles()
  for (const file of empty) {
    log.info('Deleting empty file:', file)
    await fs.remove(file)
  }
}
