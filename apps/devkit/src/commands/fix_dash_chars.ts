import type { Logger } from '@mono/node'
import fs from 'fs-extra'
import { glob } from 'glob'

export async function fixDashCharsAction(_opts: unknown, { logger: log }: { logger: Logger }) {
  const filepaths = await glob('**/*', {
    ignore: '**/{.dist,.coverage,.yarn,node_modules}/**/*',
    nodir: true,
    follow: false,
  })

  const regex = new RegExp(String.fromCharCode(8212), 'g')

  const promises = filepaths.map(async (filepath) => {
    const src = await fs.readFile(filepath, 'utf-8')
    const res = src.replace(regex, '-')
    if (src !== res) {
      await fs.writeFile(filepath, res, 'utf-8')
      log.info(`Replaced bad dash char in ${filepath}`)
    }
  })

  await Promise.all(promises)
}
