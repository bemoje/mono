import type { ICommand } from '../types'
import type { Option } from '../types'

/**
 * Finds option by name, short name or long name
 */
export function findOption<C extends ICommand>(cmd: C, nameOrShortOrLong: string): Option | undefined {
  return (
    nameOrShortOrLong.startsWith('--') ?
      cmd.options.find((o) => {
        return o.long === nameOrShortOrLong.slice(2)
      })
    : nameOrShortOrLong.startsWith('-') ?
      cmd.options.find((o) => {
        return o.short === nameOrShortOrLong.slice(1)
      })
    : cmd.options.find((o) => {
        return o.name === nameOrShortOrLong
      })
  )
}
