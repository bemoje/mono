import { timer } from '../util/timer.mjs'
import upath from 'upath'
import { getLinesOfCode } from '../util/getLinesOfCode.mjs'
import { formatTableForTerminal } from '../util/formatTableForTerminal.mjs'

await timer([upath.parse(import.meta.filename).name, 'Counting lines of code in repo...'], async (log) => {
  const counts = await getLinesOfCode()
  log.info(
    '\n' +
      formatTableForTerminal(
        Object.entries(counts).map(([k, v]) => [k, String(v.files), String(v.lines)]),
        ['file type', 'files', 'lines of code'],
      ),
  )
})
