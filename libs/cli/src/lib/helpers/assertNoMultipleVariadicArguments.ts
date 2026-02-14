import type { ICommand } from '../types'

/**
 * Ensures only one variadic argument per command
 */
export function assertNoMultipleVariadicArguments(cmd: ICommand): void {
  if (cmd.arguments.some((arg) => arg.variadic)) {
    throw new Error('Cannot add more than one variadic argument')
  }
}
