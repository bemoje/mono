import { Command } from 'commander'
import { inspect } from 'util'
import { importLibs } from '../lib/importLibs'
import { timer } from '@mono/node'
import ansiColors from 'ansi-colors'

export function list_lib_module_exports() {
  return new Command('list-lib-module-exports')
    .description('List all available modules and their exports from the libs directory.')
    .alias('llme')
    .action(async () => {
      await timer(['list-lib-module-exports', 'Listing all built modules in libs directory...'], async (log) => {
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
              // .replace(/: \{$/gm, ':')
              // .replace(/^ *\}$/gm, '')
              // .replace(/\},$/gm, '')
              // .replace(/,$/gm, ''),
            })
            .join('\n\n'),
        )

        // .split('\n')
        // .filter((line) => !/^\s*default: /.test(line))
        // .filter((line) => !/^[}]$/.test(line))
        // .join('\n'),
      })
    })
}
