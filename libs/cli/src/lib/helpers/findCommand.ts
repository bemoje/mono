import type { Command } from '../Command'
import type { ICommand } from '../types'
import { valuesOf } from '@mono/object'

/**
 * Finds subcommand by name or alias
 */
export function findCommand<C extends Command = Command>(cmd: ICommand, nameOrAlias: string): C | undefined {
  return (cmd.commands[nameOrAlias] ??
    valuesOf(cmd.commands).find((c) => {
      return c.aliases.includes(nameOrAlias)
    })) as C | undefined
}
