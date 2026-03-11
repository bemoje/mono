import type { Logger } from '@mono/node'
import cp from 'child_process'
import { outputFileIfChanged } from '../lib/outputFileIfChanged'
import { renderReadme } from '../lib/renderReadme'

export async function buildReadmeAction(_opts: unknown, { logger: log }: { logger: Logger }) {
  await outputFileIfChanged('README.md', await renderReadme({ logger: log }), log)
  cp.execSync('yarn prettier --ignore-unknown --list-different --write docs/*.md ./README.md libs/*/README.md', {
    stdio: 'inherit',
  })
}
