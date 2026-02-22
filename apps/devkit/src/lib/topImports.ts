import { MultiSet } from 'mnemonist'
import * as _monorepo from '@mono/monorepo'
import upath from 'upath'
import { MonoRepo } from '@mono/monorepo'

/**
 * Print the most imported modules across the repo.
 */
export function topImports(repo: MonoRepo, n: number = 50, normalize: (line: string) => string = (line) => line) {
  const imports = _monorepo.getAllImports(repo)

  const counters = imports
    .filter((imp) => upath.parse(imp.path).name !== 'index')
    .filter((imp) => imp.module.isDependency)
    .flatMap((imp) => {
      return imp.split().map((s) => {
        return normalize(s.replace(/^import type /, 'import ').replace('import * as ', 'import '))
      })
    })
    .filter(Boolean)
    .reduce((acc, line) => {
      return acc.add(line)
    }, new MultiSet<string>())

  return Array.from(counters.multiplicities())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([code, count]) => ({ count, code }))
}
