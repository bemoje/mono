import type { Logger } from '@mono/node'
import { forEachAsync } from 'es-toolkit'
import fs from 'fs-extra'
import { getRepoRootDirpath } from '../lib/getRepoRootDirpath'
import { glob } from 'glob'
import { outputFileIfChanged } from '../lib/outputFileIfChanged'
import upath from 'upath'

export async function fixIndexTsAction(
  dirnames: string[],
  opts: { ignore?: string[] },
  { logger }: { logger: Logger },
) {
  const repoRoot = getRepoRootDirpath()

  const libWorkspacePaths = (dirnames.length ? dirnames : await fs.readdir('libs'))
    .filter((dirname) => {
      return !opts.ignore || !opts.ignore.includes(dirname)
    })
    .map((d) => {
      return upath.joinSafe('libs', d)
    })

  await forEachAsync(
    libWorkspacePaths,
    async (wsPath) => {
      const OUTFILE = 'src/index.ts'
      const TEST_OUTFILE = 'src/index.test.ts'
      const WS_ROOT = upath.joinSafe(repoRoot, wsPath)

      const filepaths = (await glob('src/**/*.ts', { cwd: WS_ROOT }))
        .map((fp) => {
          return upath.normalizeSafe(fp)
        })
        .filter((fp) => {
          return !/[./](test|wip|old|examples?|benchmark|temp|internal)[./]/.test(fp)
        })

      const exportDirpaths = filepaths
        .filter((fp) => {
          return fp.endsWith('/index.ts') && fp !== OUTFILE
        })
        .map((fp) => {
          return upath.dirname(fp)
        })
        .sort()

      const exportFilepaths = filepaths
        .filter((fp) => {
          return !exportDirpaths.some((dp) => {
            return fp.startsWith(dp)
          })
        })
        .filter((fp) => {
          return fp !== OUTFILE
        })
        .map((fp) => {
          return fp.replace(/\.ts$/, '')
        })
        .sort()

      const relative = [...exportDirpaths, ...exportFilepaths] //
        .map((fp) => {
          return fp.replace(/^src/, '.')
        })

      // const tempName = (i: number) => {
      //   return `MODULE_${String(i + 1).padStart(relative.length.toString().length, '0')}`
      // }

      const lines = relative
        .flatMap((fp) => {
          return `export * from '${fp}'`
        })
        .concat('')

      // const tsconfig = {
      //   ...(await fs.readJson(upath.joinSafe(repoRoot, 'tsconfig.json'), 'utf8')),
      //   ...(await fs.readJson(upath.joinSafe(wsPath, 'tsconfig.json'), 'utf8')),
      // }

      // if (!tsconfig.compilerOptions.isolatedDeclarations) {
      //   lines = lines.concat(
      //     relative.map((fp, i) => {
      //       return `import * as ${tempName(i)} from '${fp}'`
      //     }),
      //     '', //
      //     `export default {`,
      //     ...relative.map((_, i) => {
      //       return `  ...${tempName(i)},${i === 0 ? ' //' : ''}`
      //     }),
      //     `}`,
      //     '',
      //   )
      // }

      const testLines = [
        `import * as EXPORTS from './index'`,
        `import { describe } from 'vitest'`,
        `import { expect } from 'vitest'`,
        `import { it } from 'vitest'`,
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

      await outputFileIfChanged(upath.joinSafe(WS_ROOT, OUTFILE), lines.join('\n'), logger)
      await outputFileIfChanged(upath.joinSafe(WS_ROOT, TEST_OUTFILE), testLines.join('\n'), logger)
    },
    { concurrency: 10 },
  )
}
