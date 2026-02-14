import { isPromise } from 'node:util/types'
import { createLogger, type Logger } from './createLogger'

/**
 * Executes a task and logs the execution time.
 */
export function timer<T>(info: string | [string, string], task: (log: Logger) => T): T {
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

  return (retval as Promise<unknown>).then((result) => {
    printResult()
    return result
  }) as T
}
