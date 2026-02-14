import type { ICommand } from '../types'

/**
 * Validates CLI argument ordering
 */
export function assertNoOptionalOrVariadicArguments(cmd: ICommand): void {
  if (cmd.arguments.some((arg) => !arg.required)) {
    throw new Error('Cannot add required argument after optional or variadic arguments')
  }
}
