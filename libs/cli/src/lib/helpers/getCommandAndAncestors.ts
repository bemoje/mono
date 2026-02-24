import type { ICommand } from '../types'

/**
 * Returns command and all ancestor commands in hierarchy
 */
export function getCommandAndAncestors<C extends ICommand>(cmd: C) {
  const result = []
  let command: ICommand | undefined = cmd as unknown as ICommand
  for (; command; command = command.parent) {
    result.push(command)
  }
  return result as [typeof cmd, ...ICommand[]]
}
