import type { ICommand, IOption } from '../types'

/** Finds option by name, short name or long name */
export default function findOption<C extends ICommand>(cmd: C, nameOrShortOrLong: string): IOption | undefined {
  return cmd.options.find(
    (o) => o.short === nameOrShortOrLong || o.long === nameOrShortOrLong || o.name === nameOrShortOrLong,
  )
}
