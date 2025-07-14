import { MonoRepo } from '@mono/monorepo'
import { Command } from 'commander'

export function mostFrequentImportStatements() {
  return new Command('mostFrequentImportStatements')
    .alias('mfis')
    .argument('[n]', 'Print top n most frequent import statements', '5000')
    .action(function mostFrequentImportStatements(n = 5000) {
      const t0 = Date.now()
      const res = new MonoRepo().topImports(n).reverse()
      const elapsed = Date.now() - t0
      res.forEach((e) => console.log(e.count, e.code))
      console.log(`Elapsed time: ${elapsed}ms`)
    })
}
