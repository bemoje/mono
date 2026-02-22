import type { ICommand } from '../types'

/**
 * Validator that checks if a command has no optional arguments.
 * This is used to determine if it's allowed to add a required argument to the command.
 */
export function hasNoOptionalArguments(cmd: ICommand): string | true {
  if (cmd.arguments.some((arg) => !arg.required)) {
    return 'An optional argument exists in command ' + cmd.name
  }
  return true
}
