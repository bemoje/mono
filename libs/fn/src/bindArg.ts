import { preserveNameAndLength } from './preserveNameAndLength'
import { ParametersWithout } from '@mono/types'

/**
 * Binds a specified argument to the provided function, returning a new function that requires
 * only the remaining arguments at call time.
 */
export function bindArg<
  Ret extends (...args: ParametersWithout<T, Index>) => ReturnType<T>,
  Index extends number = number,
  Value = unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => any = (...args: any[]) => any,
>(fn: T, boundArgIndex: Index, boundArgValue: Value) {
  return preserveNameAndLength(
    fn,
    (...args: ParametersWithout<T, Index>) => {
      return fn(...args.slice(0, boundArgIndex), boundArgValue, ...args.slice(boundArgIndex))
    },
    -1,
  ) as Ret
}
