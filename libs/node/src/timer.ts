import { round } from '@mono/number'
import { Any } from '@mono/types'
import { isPromise } from 'util/types'

/**
 * Executes a task and logs the execution time with the specified name.
 */
export function timer(name: string, task: (...args: any[]) => Any | Promise<Any>) {
  const t0 = process.hrtime.bigint()
  const printResult = () =>
    console.debug({ timer: name, ms: round(Number(process.hrtime.bigint() - t0) / 1000000, 3) })
  const rv = task()

  if (!isPromise(rv)) {
    printResult()
    return rv
  }

  return rv.then((retval) => {
    printResult()
    return retval
  })
}
