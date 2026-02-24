import type { Logger } from '@mono/node'
import { formatTableForTerminal } from '../lib/formatTableForTerminal'
import { getLinesOfCode } from '../lib/getLinesOfCode'

export async function linesOfCodeAction(_opts: unknown, { logger: log }: { logger: Logger }) {
  const counts = await getLinesOfCode()
  log.info(
    '\n' +
      formatTableForTerminal(
        Object.entries(counts).map(([k, v]) => [k, String(v.files), String(v.lines)]),
        ['file type', 'files', 'lines of code'],
      ),
  )
}
