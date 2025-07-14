/**
 * Creates a function that executes the provided async functions sequentially in order.
 */
export function sequence(...funcs: Array<() => Promise<void>>) {
  return async function () {
    for (const func of funcs) {
      await func()
    }
  }
}
