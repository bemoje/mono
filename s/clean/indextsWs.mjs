/**
 * Generates a barrel export index.ts file for a single workspace.
 * Creates exports for all TypeScript files while filtering out test/temp/example files.
 */
// npm script
import { glob } from 'glob'
import fs from 'fs-extra'
import upath from 'upath'
import { getRepoRootDirpath } from '../util/getRepoRootDirpath.mjs'

const repoRoot = getRepoRootDirpath()
const OUTFILE = 'src/index.ts'
const WS_ROOT = process.argv[2] ? upath.joinSafe(repoRoot, process.argv[2]) : process.cwd()

const filepaths = (await glob('src/**/*.ts', { cwd: WS_ROOT }))
  .map((fp) => upath.normalizeSafe(fp))
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

// console.debug({ filepaths, exportDirpaths, exportFilepaths, lines })

await fs.outputFile(upath.joinSafe(WS_ROOT, OUTFILE), lines.join('\n'))
