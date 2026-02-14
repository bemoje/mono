import type { ICommand, IOption } from '../types'

/**
 * Finds option by name, short name or long name
 */
export function findOption<C extends ICommand>(cmd: C, nameOrShortOrLong: string): IOption | undefined {
  return cmd.options.find(
    (o) => o.name === nameOrShortOrLong || o.short === nameOrShortOrLong || o.long === nameOrShortOrLong,
  )
}
