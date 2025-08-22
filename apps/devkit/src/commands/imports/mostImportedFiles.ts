import { countUniques } from '@mono/iter'
import { MonoRepo, getAllImports, resolveModuleImportPath } from '@mono/monorepo'
import { Command } from 'commander'

export function mostImportedFiles() {
  return new Command('mostImportedFiles')
    .alias('mif')
    .argument('[n]', 'Print top n most frequent import statements', '5000')
    .action(function mostImportedFiles(n = 5000) {
      const t0 = Date.now()
      const imports = getAllImports(new MonoRepo())
      const resolved = imports
        .flatMap((i) => {
          const resolvedFileName = resolveModuleImportPath(i.parent.parent.path, i.module.from)?.resolvedFileName
          return i.split().map(() => resolvedFileName)
        })
        .filter((s) => !!s) as string[]
      const res = countUniques(resolved).reverse().entriesArray().slice(0, n)
      const elapsed = Date.now() - t0
      res.forEach(([v, c]) => console.log(c, v))
      console.log(`Elapsed time: ${elapsed}ms`)
    })
}
