import { Any } from '@mono/types'
import { setName } from './setName'

/**
 * Wraps the function and returns a function that only allows the wrapped function to be called once.
 * @throws - if the wrapped function has already been called
 */

export function onceStrict<Ret, Args extends Any[]>(
  task: (...args: Args) => Ret | Promise<Ret>,
): (...args: Args) => Ret | Promise<Ret> {
  let hasRun = false

  const wrapped = async function (this: ThisParameterType<typeof task>, ...args: Args) {
    if (hasRun) {
      throw new Error('Function has already been called: ' + task.name)
    } else {
      hasRun = true
    }
    return await task.apply(this, args)
  }

  return setName(task.name, wrapped)
}
