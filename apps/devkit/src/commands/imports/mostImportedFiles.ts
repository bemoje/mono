import { ExtMap } from '@mono/map'
import { MultiSet } from 'mnemonist'
import { reduce } from 'iter-tools'
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

/**
 * Count unique occurrences of values in an iterable, returning a sorted map by count descending.
 */
function countUniques<V>(arr: Iterable<V>) {
  return new ExtMap<V, number>(
    reduce(
      new MultiSet<V>(), //
      (acc, imp) => acc.add(imp),
      arr,
    ).multiplicities(),
  ).sortByValues((a, b) => b - a)
}
