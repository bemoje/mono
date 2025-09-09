import type { CamelCase } from 'type-fest'
import assertOptionShortNameIsValid from './assertOptionShortNameIsValid'
import assertOptionShortNameNotInUse from './assertOptionShortNameNotInUse'
import assertOptionNameNotInUse from './assertOptionNameNotInUse'
import type { OptionUsage } from '../types.internal'
import type { ICommand } from '../types'

/** Parses option flags string into its components */
export default function parseOptionFlags<Long extends string>(
  cmd: ICommand,
  flags: OptionUsage<Long>,
): {
  short: string
  long: Long
  name: CamelCase<Long>
  argName: string | undefined
} {
  const match = flags.match(/^-(.+?), --([a-zA-Z][\w-]*)(?:\s*(<(.+?)>|\[(.+?)\]))?$/)
  if (!match) throw new Error(`Invalid option format: ${flags}`)
  const short = match[1]
  const long = match[2] as Long
  const argName = (match[4] || match[5])?.replace(/\.\.\.$/, '') || undefined
  assertOptionShortNameIsValid(short)
  assertOptionShortNameNotInUse(cmd, short)
  assertOptionNameNotInUse(cmd, long)
  const name = long.split('-').reduce((str, word) => {
    return str + word[0].toUpperCase() + word.slice(1)
  }) as CamelCase<Long>
  return { short, long, name, argName }
}
