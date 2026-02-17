import { MonoRepo } from '@mono/monorepo'
import { Command } from 'commander'
import { topImports } from './internal/topImports'
import { timer } from '../../lib/timer'

export function mostFrequentImportStatements() {
  return new Command('mostFrequentImportStatements')
    .alias('mfis')
    .argument('[n]', 'Print top n most frequent import statements', '5000')
    .action(async (n = 5000) => {
      await timer('imports mostFrequestImportStatements', async (log) => {
        const res = topImports(new MonoRepo(), n).reverse()
        res.forEach((e) => log.info(e.count, e.code))
      })
    })
}
