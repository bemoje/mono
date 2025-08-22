import { ExtMap } from '@mono/map'
import { MultiSet } from 'mnemonist'
import { reduce } from 'iter-tools'

/**
 * Count unique occurrences of values in an iterable, returning a sorted map by count descending.
 */
export function countUniques<V>(arr: Iterable<V>) {
  return new ExtMap<V, number>(
    reduce(
      new MultiSet<V>(), //
      (acc, imp) => acc.add(imp),
      arr,
    ).multiplicities(),
  ).sortByValues((a, b) => b - a)
}
