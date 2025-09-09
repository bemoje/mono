import type { ICommand } from '../types'

/** Validates optional args don't follow variadic args */
export default function assertNoVariadicArgument(cmd: ICommand): void {
  if (cmd.arguments.some((arg) => arg.variadic)) {
    throw new Error('Cannot add optional argument after variadic argument')
  }
}
