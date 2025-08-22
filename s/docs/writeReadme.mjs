/**
 * Generates and writes the README.md file with auto-generated documentation.
 * Renders the README content and formats it with Prettier.
 */
import fs from 'fs-extra'
import cp from 'child_process'
import { renderReadme } from '../util/renderReadme.mjs'
import { timer } from '../util/timer.mjs'

await timer(['writeReadme', 'Generating readme'], async (log) => {
  await fs.writeFile('README.md', await renderReadme(), 'utf8')
  log.info('Writing to file:', './README.md')
  cp.execSync('yarn prettier -w README.md', { stdio: 'inherit' })
})
