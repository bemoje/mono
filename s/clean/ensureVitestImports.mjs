/**
 * Ensures that all test files have the necessary Vitest imports.
 * Scans test files and automatically adds missing Vitest import statements.
 */
import fs from 'fs-extra'
import { glob } from 'glob'
import upath from 'upath'
import { timer } from '../util/timer.mjs'
import { parseArgs } from 'node:util'

const parsed = parseArgs({
  options: {
    fileGlob: { type: 'string', short: 'f', default: '{libs,apps,packages}/*/src/**/*.test.{ts,tsx}' },
  },
})

await timer(['ensureVitestImports', 'Fixing Vitest imports in test files...'], async (log) => {
  await ensureVitestImports({ ...parsed.values, log })
})

async function ensureVitestImports(fileGlob, log = console) {
  let filepaths = await glob(fileGlob, { cwd: process.cwd() }) //
    .map((filepath) => upath.normalizeSafe(filepath))

  log.info(`Found ${filepaths.length} files matching glob: ${fileGlob}`)
  if (filepaths.length === 0) return

  //
  const ignored = []
  filepaths = filepaths
    .map((filepath) => {
      const code = fs.readFileSync(filepath, 'utf-8')
      return { filepath, code }
    })
    .filter((o) => {
      const isEmpty = !o.code.trim()
      const isIgnore = isEmpty || o.code.includes(`from 'vitest'`)
      if (isIgnore) ignored.push(o.filepath)
      return !isIgnore
    })

  filepaths.map((o) => o.filepath).forEach((f) => log.info(f))
  log.info(`Found ${filepaths.length} files missing vitest import`)

  if (filepaths.length === 0) return

  //
  filepaths.map((o) => {
    const importLine = `import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, test, vitest, vi } from 'vitest'`
    fs.outputFileSync(o.filepath, `${importLine}\n\n${o.code}`, 'utf-8')
    log.info(`Added Vitest imports to: ${o.filepath}`)
  })
}
