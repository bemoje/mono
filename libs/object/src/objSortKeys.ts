import { ValueOf } from '@mono/types'

/**
 * Sorts the keys of an object in alphabetical order unless a custom compare function is provided.
 */
export function objSortKeys<T extends object>(
  o: T,
  compare?: (a: [string, ValueOf<T>], b: [string, ValueOf<T>]) => number,
): T {
  const entries = Object.entries(o)
  if (compare) entries.sort(compare)
  else entries.sort((a, b) => a[0].localeCompare(b[0]))
  return Object.fromEntries(entries) as T
}
