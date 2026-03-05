import type { Logger } from '@mono/node'
import colors from 'ansi-colors'
import { importLibs } from '../lib/importLibs'
import { inspect } from 'node:util'

export async function listLibModuleExportsAction(_opts: unknown, { logger: log }: { logger: Logger }) {
  const libs = Array.from((await importLibs()).entries())
  log.log(
    libs
      .map(([lib, modules]) => {
        return `${colors.magenta(lib)}: ${inspect(modules, { colors: false, depth: 0, breakLength: 1 })
          .replaceAll('[Module: null prototype] ', '')
          .replaceAll(/\[Function: (\w+)]/g, '[Function]')
          .replaceAll(/\[AsyncFunction: (\w+)]/g, '[AsyncFunction]')
          .replaceAll(/\[GeneratorFunction: (\w+)]/g, '[GeneratorFunction]')
          .replaceAll(/\[class [\w ]+]/g, '[Class]')
          .replaceAll(/: \[([\w ]+)]/g, (m, type) => {
            return `: ${colors.yellow.dim(`[${type}]`)}`
          })}`
      })
      .join('\n\n')
  )
}
