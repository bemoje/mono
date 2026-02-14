import type { ICommand } from '../types'

/**
 * Finds subcommand by name or alias
 */
export function findSubcommand<C extends ICommand>(cmd: C, nameOrAlias: string) {
  return cmd.commands.find((c) => c.name === nameOrAlias || c.aliases.includes(nameOrAlias)) as C | undefined
}
