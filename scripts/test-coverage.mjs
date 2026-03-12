import objectHash from 'object-hash'
import upath from 'upath'
import fs from 'fs-extra'
import { glob } from 'glob'
import { mapAsync } from 'es-toolkit'
import { uniq } from 'es-toolkit'
import ansiColors from 'ansi-colors'
import { $ } from 'execa'

const srcHashFilepath = upath.joinSafe('.cache', '.test-coverage.src.hash')
const outLogFilepath = upath.joinSafe('.cache', '.test-coverage.out.log')
const covHashFilepath = upath.joinSafe('.cache', '.test-coverage.cov.hash')

const filepaths = uniq(
  await glob(
    [
      'tsconfig.json',
      'vitest.config.js',
      'eslint.config.mjs',
      'scripts/test-coverage.mjs',
      '*{apps,libs}/*/src/**/*.ts',
      '*{apps,libs}/*/{tsconfig,package}.json',
    ],
    { nodir: true, magicalBraces: true, posix: true }
  )
).toSorted()

const sourceFileContents = await mapAsync(filepaths, async (filepath) => {
  try {
    const content =
      filepath.endsWith('.json') ?
        JSON.parse((await fs.readFile(filepath, 'utf8')).trim()) //
      : (await fs.readFile(filepath, 'utf8')).trim()
    return { filepath, content }
  } catch (_) {
    return { filepath, content: (await fs.readFile(filepath, 'utf8')).trim() }
  }
})
const curSrcHash = objectHash(sourceFileContents)

const curCovHash = objectHash(
  uniq(
    await glob('.coverage/**/*', { noDir: true, magicalBraces: true, posix: true }) //
  ).toSorted()
)

const oldOutLog = fs.existsSync(outLogFilepath) ? await fs.readFile(outLogFilepath, 'utf8') : ''
const oldSrcHash = fs.existsSync(srcHashFilepath) ? (await fs.readFile(srcHashFilepath, 'utf8')).trim() : ''
const oldCovHash = fs.existsSync(covHashFilepath) ? (await fs.readFile(covHashFilepath, 'utf8')).trim() : ''

const shouldRun =
  !oldSrcHash || !oldOutLog || !oldCovHash || oldSrcHash !== curSrcHash || curCovHash !== oldCovHash
if (!shouldRun) {
  console.log(`No changes detected. Current hash: ${oldSrcHash}`)
  console.log()
  console.log(oldOutLog)
  process.exit(0)
}

console.log(ansiColors.yellow(`Changes detected. New hash: ${curSrcHash}`))

const child = $(`yarn vitest --run --coverage --cache --bail 1 --reporter=dot`, {
  env: { FORCE_COLOR: 'true' },
  preferLocal: true,
  detatch: true,
  all: true,
  lines: true,
})

const newOutLog = []
let isSummary = false
for await (const line of child.iterable()) {
  console.log(line)

  const stripped = ansiColors.stripColor(line).trim()
  if (!isSummary && (stripped.startsWith('Test Files') || stripped.includes('== Coverage Summary =='))) {
    isSummary = true
    newOutLog.push(line)
    continue
  }
  if (isSummary) {
    newOutLog.push(line)
    if (stripped.startsWith('===================================================================')) {
      isSummary = false
    }
  }
}

const newCovHash = objectHash(
  uniq(
    await glob('.coverage/**/*', { noDir: true, magicalBraces: true, posix: true }) //
  ).toSorted()
)

await fs.outputFile(outLogFilepath, newOutLog.join('\n'))
await fs.outputFile(covHashFilepath, newCovHash)
await fs.outputFile(srcHashFilepath, curSrcHash)
console.log(ansiColors.green(`Test coverage cache updated`))
