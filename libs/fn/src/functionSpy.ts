import type { AnyAsyncFunction } from '@mono/types'
import type { TFunction } from '@mono/types'
import type { Any } from '@mono/types'
import { isAsyncFunction } from 'util/types'
import { preserveNameAndLength } from './preserveNameAndLength'

/**
 * Wraps a function so that the given @see IFunctionSpyStrategy will be applied.
 * @param func The function to wrap.
 * @param spy The strategy to apply.
 * @param options Options.
 */
export function functionSpy<T, Data>(
  func: TFunction,
  spy: IFunctionSpyStrategy<T, Data>,
  options: FunctionSpyOptions<T, Data> = {},
) {
  if (options.async === false) {
    return wrapSync(func, spy, options)
  } else if (options.async || isAsyncFunction(func)) {
    return wrapAsync(func, spy, options)
  } else {
    return wrapMaybeAsync(func, spy, options)
  }
}

export interface FunctionSpyOptions<T, Data> {
  /**
   * Whether the function is async.
   * If provided, execution is a bit faster.
   */
  async?: boolean

  /**
   * Predicate function that determines whether to skip the spy's actions for a given function call.
   */
  ignore?: IgnorePredicate<T, Data>
}

/**
 * @see functionSpy
 */
export interface IFunctionSpyStrategy<T, Data> {
  /**
   * Action to perform before the function is invoked.
   * @param thisContext The context in which the function is invoked.
   * @param args The arguments passed to the function. Modify this array to change the arguments passed to the function.
   * @returns Data to be passed to @see onReturn.
   */
  onInvoke<Args extends Any[]>(thisContext: T, args: Args): Data

  /**
   * Action to perform before the function returns.
   * @param data The data returned by @see onInvoke.
   * @param retval The return value of the function.
   * @returns The value to be returned by the wrapped function.
   */
  onReturn<Ret>(data: Data, retval: Ret): Ret
}

function wrapMaybeAsync<T, Data>(
  func: TFunction,
  spy: IFunctionSpyStrategy<T, Data>,
  options: { ignore?: IgnorePredicate<T, Data> } = {},
) {
  const ignore = options.ignore
  if (ignore && ignore(func, spy)) return func
  return preserveNameAndLength(func, function (this: T, ...args: any[]) {
    if (ignore && ignore(func, spy, this)) {
      return func.apply(this, args)
    }
    const data = spy.onInvoke(this, args)
    const retval = func.apply(this, args)
    if (retval instanceof Promise) {
      return retval.then((retval) => {
        return spy.onReturn(data, retval)
      })
    } else {
      return spy.onReturn(data, retval)
    }
  })
}

function wrapSync<T, Data>(
  func: TFunction,
  spy: IFunctionSpyStrategy<T, Data>,
  options: { ignore?: IgnorePredicate<T, Data> } = {},
) {
  const ignore = options.ignore
  if (ignore && ignore(func, spy)) return func
  return preserveNameAndLength(func, function (this: T, ...args: any[]) {
    if (ignore && ignore(func, spy, this)) {
      return func.apply(this, args)
    }
    const data = spy.onInvoke(this, args)
    const retval = func.apply(this, args)
    return spy.onReturn(data, retval)
  })
}

function wrapAsync<T, Data>(
  func: AnyAsyncFunction,
  spy: IFunctionSpyStrategy<T, Data>,
  options: { ignore?: IgnorePredicate<T, Data> } = {},
) {
  const ignore = options.ignore
  if (ignore && ignore(func, spy)) return func
  return preserveNameAndLength(func, async function (this: T, ...args: any[]) {
    if (ignore && ignore(func, spy, this)) {
      return await func.apply(this, args)
    }
    const data = spy.onInvoke(this, args)
    const retval = await func.apply(this, args)
    return spy.onReturn(data, retval)
  })
}

export type IgnorePredicate<T, Data> = (
  func: TFunction,
  spy: IFunctionSpyStrategy<T, Data>,
  thisContext?: T,
) => boolean
