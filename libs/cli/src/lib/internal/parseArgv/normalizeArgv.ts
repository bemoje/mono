import type { Option } from '../../types'

/** Map long option names (kebab-case) to their camelCased equivalents in argv */
export function normalizeArgv(argv: string[], options: Option[]): string[] {
  for (const o of options) {
    if (o.long === o.name) continue
    argv = argv.map((a) => {
      if (a === `--${o.long}`) return `--${o.name}`
      if (a === `--no-${o.long}`) return `--no-${o.name}`
      return a
    })
  }
  return argv
}
