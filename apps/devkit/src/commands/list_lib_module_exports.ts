import type { Logger } from '@mono/node'
import { inspect } from 'node:util'
import { importLibs } from '../lib/importLibs'
import ansiColors from 'ansi-colors'

export async function listLibModuleExportsAction(_opts: unknown, { logger: log }: { logger: Logger }) {
  const libs = Array.from((await importLibs()).entries())
  log.log(
    libs
      .map(([lib, modules]) => {
        return (
          `${ansiColors.magenta(lib)}: ` +
          inspect(modules, { colors: false, depth: 0, breakLength: 1 })
            .replace(/\[Module: null prototype\] /g, '')
            .replace(/\[Function: (\w+)\]/g, '[Function]')
            .replace(/\[AsyncFunction: (\w+)\]/g, '[AsyncFunction]')
            .replace(/\[GeneratorFunction: (\w+)\]/g, '[GeneratorFunction]')
            .replace(/\[class [\w ]+\]/g, '[Class]')
            .replace(/: \[([\w ]+)\]/g, (m, type) => ': ' + ansiColors.yellow.dim('[' + type + ']'))
        )
      })
      .join('\n\n'),
  )
}
