import { timer } from '@mono/node'
import { Command } from 'commander'
import { formatTableForTerminal } from '../lib/formatTableForTerminal'
import { getLinesOfCode } from '../lib/getLinesOfCode'

export function lines_of_code() {
  return new Command('count-lines-of-code') //
    .alias('cloc')
    .description('Count lines of code in the repo.')
    .action(async () => {
      await timer(['lines-of-code', 'Counting lines of code in repo...'], async (log) => {
        const counts = await getLinesOfCode()
        log.info(
          '\n' +
            formatTableForTerminal(
              Object.entries(counts).map(([k, v]) => [k, String(v.files), String(v.lines)]),
              ['file type', 'files', 'lines of code'],
            ),
        )
      })
    })
}
