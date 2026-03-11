import type { Logger } from './createLogger'
import colors from 'ansi-colors'
import { createLogger } from './createLogger'
import humanizeDuration from 'humanize-duration'
import { isPromise } from 'util/types'

/**
 * Executes a task and logs the execution time.
 */
export function timer<T>(
  arg: string | [name: string, description: string],
  task: (log: Logger, name: string) => T
): T {
  const t0 = process.hrtime.bigint()
  const [name, description] = Array.isArray(arg) ? arg : [arg, '']
  const log = createLogger(name)

  if (name && description) {
    log.start(description)
  }

  const retval = task(log, name)

  if (!isPromise(retval)) {
    return done(retval)
  }

  return (retval as Promise<Awaited<T>>).then((result) => {
    return done(result)
  }) as T

  function done(retval: T) {
    if (process.exitCode) {
      return retval
    }
    const ns = process.hrtime.bigint() - t0
    const ms = Math.floor(Number(ns) / 1_000_000)
    log.done(colors.dim(humanizeDuration(ms)))
    return retval
  }
}
