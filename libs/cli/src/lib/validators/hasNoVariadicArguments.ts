import type { ICommand } from '../types'

/**
 * Validator that checks if a command has no variadic arguments.
 * This is used to determine if it's allowed to add a required argument to the command.
 */
export function hasNoVariadicArguments(cmd: ICommand): string | true {
  if (cmd.arguments.some((arg) => arg.variadic)) {
    return 'A variadic argument exists in command ' + cmd.name
  }
  return true
}
