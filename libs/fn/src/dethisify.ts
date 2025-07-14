import type { Any } from '@mono/types'
import { preserveNameAndLength } from './preserveNameAndLength'

/**
 * Converts a function from a class method by by making the first argument take the place of the 'this' context.
 * The reverse of @see thisify.
 */
export function dethisify<T extends object, Args extends Any[], Ret>(
  fn: (this: T, ...args: Args) => Ret,
): (target: T, ...args: Args) => Ret {
  return preserveNameAndLength(
    fn,
    function (target: T, ...args: Args): Ret {
      return fn.apply(target, args) as Ret
    },
    1,
  )
}
