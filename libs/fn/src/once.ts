import { Any } from '@mono/types'
import { setName } from './setName'

/**
 * Wraps the function and returns a function that only allows the wrapped function to be executed once.
 * If the wrapped function has already been called, the return value of the first call is returned.
 * Preserves sync/async behavior of the original function.
 * If the first call threw an error, subsequent calls will throw the same error.
 */
export function once<Ret, Args extends Any[]>(task: (...args: Args) => Ret): (...args: Args) => Ret
export function once<Ret, Args extends Any[]>(
  task: (...args: Args) => Promise<Ret>,
): (...args: Args) => Promise<Ret>
export function once<Ret, Args extends Any[]>(
  task: (...args: Args) => Ret | Promise<Ret>,
): (...args: Args) => Ret | Promise<Ret> {
  let hasRun = false
  let retval: Ret | Promise<Ret>
  let error: unknown

  const wrapped = function (this: ThisParameterType<typeof task>, ...args: Args) {
    if (hasRun) {
      if (error !== undefined) {
        throw error
      }
      return retval as Ret | Promise<Ret>
    } else {
      hasRun = true
    }
    try {
      retval = task.apply(this, args)
      return retval
    } catch (err) {
      error = err
      throw err
    }
  }

  return setName(task.name, wrapped)
}
