import PQueue from 'p-queue'
import { setName } from './setName'

/**
 * Creates a throttled version of an async function that limits the rate at which the function can be called.
 * @param task - The async function to throttle.
 * @param optionsOrConcurrency - The options object or the number of concurrent executions.
 */
export function maxConcurrency<Ret, Args extends unknown[]>(
  task: (...args: Args) => Promise<Ret>,
  optionsOrConcurrency: number | ConcurrencyOptions,
): (...args: Args) => Promise<Ret> {
  const options =
    typeof optionsOrConcurrency === 'number' //
      ? { concurrency: optionsOrConcurrency }
      : optionsOrConcurrency

  const queue = new PQueue({
    concurrency: options.concurrency,
    autoStart: true,
  })

  return setName(task, async function (...args: Args) {
    return (await queue.add(() => task(...args))) as Ret
  })
}

export interface ConcurrencyOptions {
  /**
   * The maximum number of concurrent executions.
   */
  concurrency: number
}
