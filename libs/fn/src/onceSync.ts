import { Any } from '@mono/types'
import { setName } from './setName'

/**
 * Wraps the function and returns a
 *  function that only allows the wrapped function to be executed once.
 * If the wrapped function has already been called, the return value of the first call is returned.
 * If the first call threw an error, subsequent calls will throw the same error.
 */
export function onceSync<Ret, Args extends Any[]>(
  task: (...args: Args) => Ret | Ret,
): (...args: Args) => Ret | Ret {
  let hasRun = false
  let retval: Ret
  let error: unknown

  const wrapped = function (this: ThisParameterType<typeof task>, ...args: Args) {
    if (hasRun) {
      if (error !== undefined) {
        throw error
      }
      return retval
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
