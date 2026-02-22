import { Command } from 'commander'
import fs from 'fs-extra'
import { globSync } from 'glob'
import upath from 'upath'
import { timer } from '@mono/node'

export function fix_vitest_imports() {
  return new Command('fix-vitest-imports')
    .alias('fvi')
    .description('Ensure all test files have necessary Vitest imports.')
    .argument('[glob]', 'File glob pattern', '{libs,apps,packages}/*/src/**/*.test.{ts,tsx}')
    .action(async (fileGlob: string) => {
      await timer('clean fix-vitest-imports', async (log) => {
        const filepaths = globSync(fileGlob, { cwd: process.cwd() }).map((fp) => upath.normalizeSafe(fp))

        log.info(`Found ${filepaths.length} files matching glob: ${fileGlob}`)
        if (filepaths.length === 0) return

        const filesWithCode = filepaths
          .map((filepath) => {
            const code = fs.readFileSync(filepath, 'utf-8')
            return { filepath, code }
          })
          .filter((o) => {
            const isEmpty = !o.code.trim()
            return !(isEmpty || o.code.includes(`from 'vitest'`))
          })

        filesWithCode.map((o) => o.filepath).forEach((f) => log.info(f))
        log.info(`Found ${filesWithCode.length} files missing vitest import`)

        if (filesWithCode.length === 0) return

        filesWithCode.forEach((o) => {
          const importLine = `import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, test, vitest, vi } from 'vitest'`
          fs.outputFileSync(o.filepath, `${importLine}\n\n${o.code}`, 'utf-8')
          log.info(`Added Vitest imports to: ${o.filepath}`)
        })
      })
    })
}
