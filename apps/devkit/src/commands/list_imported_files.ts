import { countUniques } from '@mono/array'
import { getAllImports, MonoRepo, resolveModuleImportPath } from '@mono/monorepo'
import { timer } from '@mono/node'
import { Command } from 'commander'

export function list_imported_files() {
  return new Command('list-imported-files')
    .alias('lif')
    .description('List the most imported files across the repo.')
    .argument('[n]', 'Print top n most frequent import statements', '5000')
    .action(async (n = 5000) => {
      await timer('list-imported-files', async (log) => {
        const imports = getAllImports(new MonoRepo())
        const resolved = imports
          .flatMap((i) => {
            const resolvedFileName = resolveModuleImportPath(i.parent.parent.path, i.module.from)?.resolvedFileName
            return i.split().map(() => resolvedFileName)
          })
          .filter((s) => !!s) as string[]
        const res = countUniques(resolved).reverse().entriesArray().slice(0, n)
        res.forEach(([v, c]) => log.info(c, v))
      })
    })
}
