/**
 * Generates a barrel export index.ts file for a single workspace.
 * Creates exports for all TypeScript files while filtering out test/temp/example files.
 */
import { glob } from 'glob'
import upath from 'upath'
import { getRepoRootDirpath } from '../util/getRepoRootDirpath.mjs'
import { outputFileIfChanged } from '../util/outputFileIfChanged.mjs'

const repoRoot = getRepoRootDirpath()
const OUTFILE = 'src/index.ts'
const TEST_OUTFILE = 'src/index.test.ts'
const WS_ROOT = process.argv[2] ? upath.joinSafe(repoRoot, process.argv[2]) : process.cwd()
const IGNORE_DIRS = process.argv[3] ? process.argv[3].split(',') : []

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

const lines = [...exportDirpaths, ...exportFilepaths] //
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

// console.debug({ filepaths, exportDirpaths, exportFilepaths, lines, testLines })

await outputFileIfChanged(upath.joinSafe(WS_ROOT, OUTFILE), lines.join('\n'))
await outputFileIfChanged(upath.joinSafe(WS_ROOT, TEST_OUTFILE), testLines.join('\n'))
