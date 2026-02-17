import { Command } from 'commander'
import { timer } from '../../lib/timer'
import { buildLibsWorkspace } from '../../lib/buildLibsWorkspace'
import { getAllWorkspacePaths } from '../../lib/workspaces'
import upath from 'upath'
import { getRepoRootDirpath } from '../../lib/getRepoRootDirpath'

export function buildCommands() {
  return new Command('build')
    .alias('b')
    .description('Build workspace(s).')
    .addCommand(buildLib())
    .addCommand(buildAllLibs())
}

function buildLib() {
  return new Command('lib')
    .description('Build a single libs/ workspace.')
    .argument('<dirname>', 'Directory name of the library under libs/')
    .option('--debug', 'Enable debug output', false)
    .action(async (dirname: string, opts: { debug: boolean }) => {
      await timer(['build lib', `Building ${dirname}...`], async () => {
        const wsDir = upath.join(getRepoRootDirpath(), 'libs', dirname)
        await buildLibsWorkspace(wsDir, { debug: opts.debug })
      })
    })
}

function buildAllLibs() {
  return new Command('all-libs')
    .description('Build all libs/ workspaces.')
    .option('--debug', 'Enable debug output', false)
    .action(async (opts: { debug: boolean }) => {
      await timer(['build all-libs', `Building libraries...`], async (log) => {
        const wsPaths = await getAllWorkspacePaths()
        const libPaths = wsPaths.filter((p) => p.startsWith('libs/'))
        for (const wsPath of libPaths) {
          const wsDir = upath.join(getRepoRootDirpath(), wsPath)
          log.info(`Building ${wsPath}...`)
          await buildLibsWorkspace(wsDir, { debug: opts.debug })
        }
      })
    })
}
