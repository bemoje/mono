/**
 * Validates TSDoc documentation for all library exports.
 * Ensures that all exported functions and classes have proper JSDoc documentation.
 */
import { parseLibsTsDocSummaries } from '../util/renderReadme.mjs'
import { timer } from '../util/timer.mjs'
import upath from 'upath'

await timer(
  [
    upath.parse(import.meta.filename).name,
    'Checking library exports all have TSDoc and that exports follow pattern that each export must have its own dedicated file...',
  ],
  async (log) => {
    const { printLogs } = await parseLibsTsDocSummaries()
    printLogs(log)
  },
)
