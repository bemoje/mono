import { Command } from 'commander'
import fs from 'fs-extra'
import { globSync } from 'glob'
import upath from 'upath'
import { glob } from 'glob'
import { timer } from '../../lib/timer'
import { getEmptyWsFiles } from '../../lib/getEmptyWsFiles'
import { getRepoRootDirpath } from '../../lib/getRepoRootDirpath'
import { outputFileIfChanged } from '../../lib/outputFileIfChanged'

export function cleanCommands() {
  return new Command('clean')
    .alias('cl')
    .description('Repo cleanup tasks.')
    .addCommand(cleanVitestImports())
    .addCommand(cleanIndexTs())
    .addCommand(cleanEmptyFiles())
    .addCommand(cleanDashChars())
}

function cleanVitestImports() {
  return new Command('vitest-imports')
    .description('Ensure all test files have necessary Vitest imports.')
    .argument('[glob]', 'File glob pattern', '{libs,apps,packages}/*/src/**/*.test.{ts,tsx}')
    .action(async (fileGlob: string) => {
      await timer(['ensureVitestImports', 'Fixing Vitest imports in test files...'], async (log) => {
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

function cleanIndexTs() {
  return new Command('index-ts')
    .description('Generate barrel export index.ts for a workspace.')
    .argument('<wsPath>', 'Workspace path (relative to repo root)')
    .argument('[ignoreDirs]', 'Comma-separated dirs to ignore')
    .action(async (wsPath?: string, ignoreDirs?: string) => {
      const repoRoot = getRepoRootDirpath()
      const OUTFILE = 'src/index.ts'
      const TEST_OUTFILE = 'src/index.test.ts'
      const WS_ROOT = wsPath ? upath.joinSafe(repoRoot, wsPath) : process.cwd()
      const IGNORE_DIRS = ignoreDirs ? ignoreDirs.split(',') : []

      const filepaths = (await glob('src/**/*.ts', { cwd: WS_ROOT }))
        .map((fp) => upath.normalizeSafe(fp))
        .filter((fp) => IGNORE_DIRS.every((dir) => !fp.includes('src/' + dir + '/')))
        .filter((fp) => !/[./](test|wip|old|examples?|benchmark|temp|internal)[./]/.test(fp))

      const exportDirpaths = filepaths
        .filter((fp) => fp.endsWith('/index.ts') && fp !== OUTFILE)
        .map((fp) => upath.dirname(fp))
        .sort()

      const exportFilepaths = filepaths
        .filter((fp) => !exportDirpaths.some((dp) => fp.startsWith(dp)))
        .filter((fp) => fp !== OUTFILE)
        .map((fp) => fp.replace(/\.ts$/, ''))
        .sort()

      const lines = [...exportDirpaths, ...exportFilepaths]
        .map((fp) => fp.replace(/^src/, '.'))
        .map((fp) => `export * from '${fp}'`)
        .concat('')

      const testLines = [
        `import { describe, expect, it } from 'vitest'`,
        `import * as EXPORTS from './index'`,
        ``,
        `describe('index.ts', () => {`,
        `  it('should load modules', () => {`,
        `    for (const [key, value] of Object.entries(EXPORTS)) {`,
        `      expect(key).toBeTypeOf('string')`,
        `      expect(value).not.toBeUndefined()`,
        `    }`,
        `  })`,
        `})`,
        ``,
      ]

      await outputFileIfChanged(upath.joinSafe(WS_ROOT, OUTFILE), lines.join('\n'))
      await outputFileIfChanged(upath.joinSafe(WS_ROOT, TEST_OUTFILE), testLines.join('\n'))
    })
}

function cleanEmptyFiles() {
  return new Command('empty-files').description('Remove empty files from all workspaces.').action(async () => {
    await timer(['removeEmptyWsFiles', 'Deleting empty files in all workspaces'], async (log) => {
      const empty = await getEmptyWsFiles()
      for (const file of empty) {
        log.info('Deleting empty file:', file)
        await fs.remove(file)
      }
    })
  })
}

function cleanDashChars() {
  return new Command('dash-chars')
    .description('Replace bad dash characters (em-dash) with regular dashes.')
    .action(async () => {
      const filepaths = await glob('**/*', {
        ignore: '**/{.dist,.coverage,.yarn,node_modules}/**/*',
        nodir: true,
        follow: false,
      })

      const regex = new RegExp(String.fromCharCode(8212), 'g')

      const promises = filepaths.map(async (filepath) => {
        const src = await fs.readFile(filepath, 'utf-8')
        const res = src.replace(regex, '-')
        if (src !== res) {
          await fs.writeFile(filepath, res, 'utf-8')
          console.log(`Replaced bad dash char in ${filepath}`)
        }
      })

      await Promise.all(promises)
    })
}
