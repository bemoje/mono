import type { Any } from '@mono/types'
import { ArraySlice } from 'type-fest'
import { preserveNameAndLength } from './preserveNameAndLength'

/**
 * Converts a function to a class method by making the 'this' context the first argument.
 */
export function thisify<T, Args extends Any[], Ret>(
  fn: (target: T, ...args: Args) => Ret,
): (this: T, ...args: Args) => Ret {
  return preserveNameAndLength(
    fn,
    function f(this: T, ...args: Args): Ret {
      return fn(this, ...args)
    },
    -1,
  )
}

export type Thisify<T extends object, F extends (target: T, ...args: any[]) => Any> = (
  this: T,
  ...args: ArraySlice<Parameters<F>, 1>
) => ReturnType<F>
