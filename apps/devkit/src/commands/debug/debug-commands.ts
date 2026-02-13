import { Command } from 'commander'
import fs from 'node:fs'
import upath from 'upath'
import { execSync } from 'node:child_process'
import { glob } from 'glob'
import { timer } from '../../lib/timer'
import { getRepoRootDirpath } from '../../lib/getRepoRootDirpath'

export function debugCommands() {
  return new Command('debug').description('Debugging and maintenance tools.').addCommand(debugFullReinstall())
}

function debugFullReinstall() {
  return new Command('full-reinstall')
    .description('Completely removes and reinstalls all node_modules and lock files.')
    .action(async () => {
      await timer('nodeModulesFullReinstall', async (log) => {
        const root = getRepoRootDirpath()

        const paths = (
          await glob([
            '{apps,libs,packages}/*/{node_modules,package-lock.json}',
            'yarn.lock',
            'package-lock.json',
            'node_modules',
          ])
        )
          .map((dp) => upath.normalize(dp))
          .sort()

        log.info('Deleting:')
        paths.forEach((p, i) => log.info('', i, p))

        for (const p of paths.filter((p) => fs.existsSync(p))) {
          fs.rmSync(p, { recursive: true, force: true })
        }

        log.info('Clearing yarn cache...')
        execSync('yarn cache clear', {
          stdio: 'inherit',
          cwd: root,
        })

        log.info('yarn install...')
        execSync('yarn install', {
          stdio: 'inherit',
          cwd: root,
        })
      })
    })
}
