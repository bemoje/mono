import type { CamelCase } from 'type-fest'
import type { OptionUsage } from '../types.internal'

/**
 * Parses option flags string into its components
 */
export function parseOptionFlags<Long extends string>(
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
  if (short.length !== 1) {
    throw new Error(`Expected short name to be a single character. Got: -${short}`)
  }

  const long = match[2] as Long
  const argName = (match[4] || match[5])?.replace(/\.\.\.$/, '') || undefined
  const name = long.split('-').reduce((str, word) => {
    return str + word[0].toUpperCase() + word.slice(1)
  }) as CamelCase<Long>

  return { short, long, name, argName }
}
