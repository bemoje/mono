import type { Logger } from '@mono/node'
import fs from 'fs-extra'
import cp from 'node:child_process'
import { renderReadme } from '../lib/renderReadme'

export async function buildReadmeAction(_opts: unknown, { logger: log }: { logger: Logger }) {
  await fs.writeFile('README.md', await renderReadme(), 'utf8')
  log.info('Writing to file:', './README.md')
  cp.execSync('yarn format:write', { stdio: 'inherit' })
}
