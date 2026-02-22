import { Command } from 'commander'
import fs from 'fs-extra'
import { glob } from 'glob'
import { timer } from '@mono/node'

export function fix_dash_chars() {
  return new Command('fix-dash-chars')
    .alias('fdc')
    .description('Replace bad dash characters (em-dash) with regular dashes.')
    .action(async () => {
      await timer('fix-dash-chars', async (log) => {
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
      })
    })
}
