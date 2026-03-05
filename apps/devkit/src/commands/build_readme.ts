import type { Logger } from '@mono/node'
import cp from 'node:child_process'
import fs from 'fs-extra'
import { renderReadme } from '../lib/renderReadme'

export async function buildReadmeAction(_opts: unknown, { logger: log }: { logger: Logger }) {
  await fs.writeFile('README.md', await renderReadme(), 'utf8')
  log.info('Writing to file:', './README.md')
  cp.execSync('yarn prettier --ignore-unknown --write ./README.md', { stdio: 'inherit' })
}
