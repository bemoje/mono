import { preserveNameAndLength } from './preserveNameAndLength'

/**
 * Wraps a function to transform its return value using a transform function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformReturnValue<T, Args extends any[], Ret, NewRet>(
  fn: (this: T, ...args: Args) => Ret,
  transform: (value: Ret) => NewRet,
): (this: T, ...args: Args) => NewRet {
  return preserveNameAndLength(fn, function (this: T, ...args: Args): NewRet {
    const result = fn.apply(this, args)
    return transform(result)
  })
}
