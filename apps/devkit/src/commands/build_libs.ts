import { Command } from 'commander'
import { timer } from '@mono/node'
import { buildLibsWorkspace } from '../lib/buildLibsWorkspace'
import upath from 'upath'
import { getRepoRootDirpath } from '../lib/getRepoRootDirpath'
import fs from 'fs-extra'

export function build_libs() {
  return new Command('build-libs')
    .alias('bl')
    .description('Build all libs/ workspaces.')
    .argument('[dirnames...]', 'libs dirnames. Defaults to all.')
    .option('--debug', 'Enable debug output', false)
    .action(async (dirnames: string[], opts: { debug: boolean }) => {
      await timer(['build libs', `Building libraries...`], async (log) => {
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
      })
    })
}
