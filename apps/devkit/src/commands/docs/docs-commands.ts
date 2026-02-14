import { Command } from 'commander'
import fs from 'fs-extra'
import cp from 'node:child_process'
import { timer } from '../../lib/timer'
import { renderReadme } from '../../lib/renderReadme'

export function docsCommands() {
  return new Command('docs').alias('do').description('Documentation generation tools.').addCommand(docsReadme())
}

function docsReadme() {
  return new Command('readme').description('Generate the root README.md from template.').action(async () => {
    await timer(['writeReadme', 'Generating readme'], async (log) => {
      await fs.writeFile('README.md', await renderReadme(), 'utf8')
      log.info('Writing to file:', './README.md')
      cp.execSync('yarn prettier -w README.md', { stdio: 'inherit' })
    })
  })
}
