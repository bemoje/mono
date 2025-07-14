import { getClassChain } from './getClassChain'
import { AnyConstructor } from '@mono/types'

/**
 * Iterator version of getClassChain - yields constructors/classes.
 */
export function iterateClasses(
  target: object | AnyConstructor,
  options?: { includeSelf?: boolean },
): Generator<AnyConstructor> {
  return (function* () {
    for (const cls of getClassChain(target, options)) {
      yield cls
    }
  })()
}
