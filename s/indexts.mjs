// npm script
import { glob } from 'glob'
import fs from 'fs-extra'
import path from 'upath'

const OUTFILE = 'src/index.ts'

const filepaths = (await glob('src/**/*.ts'))
  .map((fp) => path.normalizeSafe(fp))
  .filter((fp) => !/[./](spec|test|wip|old|examples?|benchmark|temp|internal)[./]/.test(fp))

const exportDirpaths = filepaths
  .filter((fp) => fp.endsWith('/index.ts') && fp !== OUTFILE)
  .map((fp) => path.dirname(fp))
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

await fs.outputFile(OUTFILE, lines.join('\n'))
