import { getPrototypeChain } from './getPrototypeChain'

/**
 * Iterator version of getPrototypeChain - yields prototype objects.
 */
export function iteratePrototypes(target: object, options?: { includeSelf?: boolean }): Generator<object> {
  return (function* () {
    for (const proto of getPrototypeChain(target, options)) {
      yield proto
    }
  })()
}
