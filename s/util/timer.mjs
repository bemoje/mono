/**
 * Utility for measuring and logging execution time of tasks.
 * Provides consistent timing output with logger integration.
 */
import { isPromise } from 'node:util/types'
import { createLogger } from './createLogger.mjs'

/**
 * Executes a task and logs the execution time with the specified name.
 */
export function timer(info, task) {
  const [name, description] = Array.isArray(info) ? info : [info, '']
  const log = createLogger(name)
  log.start(description)
  const t0 = process.hrtime.bigint()

  const printResult = () => {
    const ms = Math.floor(Number(process.hrtime.bigint() - t0) / 1000000)
    log.done(ms, 'ms')
  }

  const retval = task(log)

  if (!isPromise(retval)) {
    printResult()
    return retval
  }

  return retval.then((retval) => {
    printResult()
    return retval
  })
}
