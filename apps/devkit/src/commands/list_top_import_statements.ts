import { MonoRepo } from '@mono/monorepo'
import { timer } from '@mono/node'
import { Command } from 'commander'
import { topImports } from '../lib/topImports'

export function list_top_import_statements() {
  return new Command('list-top-import-statements')
    .alias('ltis')
    .argument('[n]', 'Print top n most frequent import statements', '5000')
    .action(async (n = 5000) => {
      await timer('list-top-import-statements', async (log) => {
        const res = topImports(new MonoRepo(), n).reverse()
        res.forEach((e) => log.info(e.count, e.code))
      })
    })
}
