import type { Logger } from '@mono/node'
import fs from 'fs-extra'
import { globSync } from 'glob'
import upath from 'upath'

export async function fixVitestImportsAction(
  fileGlob: string,
  _opts: unknown,
  { logger: log }: { logger: Logger }
) {
  const filepaths = globSync(fileGlob, { cwd: process.cwd() }).map((fp) => {
    return upath.normalizeSafe(fp)
  })

  log.info(`Found ${filepaths.length} files matching glob: ${fileGlob}`)
  if (filepaths.length === 0) {
    return
  }

  const filesWithCode = filepaths
    .map((filepath) => {
      const code = fs.readFileSync(filepath, 'utf-8')
      return { filepath, code }
    })
    .filter((o) => {
      const isEmpty = !o.code.trim()
      return !(isEmpty || o.code.includes(`from 'vitest'`))
    })

  filesWithCode
    .map((o) => {
      return o.filepath
    })
    .forEach((f) => {
      return log.info(f)
    })
  log.info(`Found ${filesWithCode.length} files missing vitest import`)

  if (filesWithCode.length === 0) {
    return
  }

  filesWithCode.forEach((o) => {
    const importLine = `import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, test, vitest, vi } from 'vitest'`
    fs.outputFileSync(o.filepath, `${importLine}\n\n${o.code}`, 'utf-8')
    log.info(`Added Vitest imports to: ${o.filepath}`)
  })
}
