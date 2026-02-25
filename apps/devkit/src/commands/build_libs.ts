import type { Logger } from '@mono/node'
import { buildLibsWorkspace } from '../lib/buildLibsWorkspace'
import fs from 'fs-extra'
import { getRepoRootDirpath } from '../lib/getRepoRootDirpath'
import upath from 'upath'

export async function buildLibsAction(
  dirnames: string[],
  opts: { debug?: boolean },
  { logger: log }: { logger: Logger },
) {
  if (dirnames.length === 0) {
    dirnames = await fs.readdir(upath.join(getRepoRootDirpath(), 'libs'))
  }
  for (const dirname of dirnames) {
    if (!(await fs.pathExists(upath.join(getRepoRootDirpath(), 'libs', dirname)))) {
      throw new Error(`Directory does not exist: libs/${dirname}`)
    }
  }
  const failed = [] as string[]
  for (const dirname of dirnames) {
    const wsDir = upath.join(getRepoRootDirpath(), 'libs', dirname)
    log.info(`Building ${dirname}...`)
    try {
      await buildLibsWorkspace(wsDir, { debug: opts.debug })
    } catch (error) {
      log.error(error)
      failed.push(dirname)
    }
  }
  if (failed.length) {
    log.error(`Failed to build the following workspaces: ${failed.join(', ')}`)
    process.exit(1)
  }
}
