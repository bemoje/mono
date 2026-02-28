import { isFunction } from 'es-toolkit/predicate'
import { setNameAndLength } from './setNameAndLength'

/**
 * Returns a function that redirects or 'proxies' the 'this' context of the input function
 * to a property of a given key.
 */
export function thisProxy<ThisTarget extends This, This extends object, Args extends AnyArgs, Ret>(
  fn: (this: This, ...args: Args) => Ret,
  proxy: PropertyKey,
): (this: ThisTarget, ...args: Args) => Ret

/**
 * Returns a function that redirects or 'proxies' the 'this' context of the input function
 * to a callback that returns the target object.
 */
export function thisProxy<ThisTarget extends This, This extends object, Args extends AnyArgs, Ret>(
  fn: (this: This, ...args: Args) => Ret,
  proxy: (object: ThisTarget) => This,
): (this: ThisTarget, ...args: Args) => Ret

/**
 * Returns a function that redirects or 'proxies' the 'this' context of the input function
 * to either a property of a given key, or a callback that returns the target object.
 */
export function thisProxy<ThisTarget extends This, This extends object, Args extends AnyArgs, Ret>(
  fn: (this: This, ...args: Args) => Ret,
  proxy: PropertyKey | ((object: ThisTarget) => This),
) {
  return isFunction(proxy) ? thisProxyCallback(fn, proxy) : thisProxyKey(fn, proxy)
}

/**
 *
 */
function thisProxyKey<ThisTarget extends This, This extends object, Args extends AnyArgs, Ret>(
  fn: (this: This, ...args: Args) => Ret,
  proxy: PropertyKey,
): (this: ThisTarget, ...args: Args) => Ret {
  return setNameAndLength(fn, function (this: ThisTarget, ...args: Args): Ret {
    const thisArg = this[proxy as keyof ThisTarget] as This
    return fn.apply(thisArg, args)
  })
}

/**
 *
 */
function thisProxyCallback<ThisTarget extends This, This extends object, Args extends AnyArgs, Ret>(
  fn: (this: This, ...args: Args) => Ret,
  proxy: (object: ThisTarget) => This,
): (this: ThisTarget, ...args: Args) => Ret {
  return setNameAndLength(fn, function (this: ThisTarget, ...args: Args): Ret {
    const thisArg = proxy(this)
    return fn.apply(thisArg, args)
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyArgs = any[]
