import { Command } from 'commander'
import fs from 'fs-extra'
import cp from 'node:child_process'
import { renderReadme } from '../lib/renderReadme'
import { timer } from '@mono/node'

export function build_readme() {
  return new Command('build-readme')
    .alias('br')
    .description('Generate the root README.md from template.')
    .action(async () => {
      await timer(['build-readme', 'Generating readme'], async (log) => {
        await fs.writeFile('README.md', await renderReadme(), 'utf8')
        log.info('Writing to file:', './README.md')
        cp.execSync('yarn format:write', { stdio: 'inherit' })
      })
    })
}
