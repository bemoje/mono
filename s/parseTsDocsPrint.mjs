import { parseTsDocs } from './util/parseTsDocs.mjs'
import colors from 'ansi-colors'

const { filesSummaries, filesSummariesMissing, libExportNotInDedicatedFile } = await parseTsDocs()

console.log('------------------')
console.log(colors.bold.green('filesSummaries:'))
const lines = filesSummaries.map((o) => colors.cyan(o.filepath) + ' :: ' + colors.gray(o.summary))
console.log(lines.join('\n'))

if (filesSummariesMissing.length) {
  console.log('------------------')
  console.log(colors.bold.yellow('filesSummariesMissing:'))
  const lines = filesSummariesMissing.map((filepath) => colors.gray(filepath))
  console.log(lines.join('\n'))
}

if (libExportNotInDedicatedFile.length) {
  console.log('------------------')
  console.log(colors.bold.yellow('libExportNotInDedicatedFile:'))
  console.log(libExportNotInDedicatedFile.map((s) => colors.gray(s)).join('\n'))
}

console.log({
  filesSummaries: filesSummaries.length,
  filesSummariesMissing: filesSummariesMissing.length,
  libExportNotInDedicatedFile: libExportNotInDedicatedFile.length,
})
