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
  { logger }: { logger: Logger }
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
    async (wsDirpath) => {
      const OUTFILE = 'src/index.ts'
      const TEST_OUTFILE = 'src/index.test.ts'
      const WS_ROOT = upath.joinSafe(repoRoot, wsDirpath)

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
          return upath.dirname(`${fp}/index`)
        })
        .sort()

      const exportFilepaths = filepaths
        .filter((fp) => {
          return !exportDirpaths.some((dp) => {
            return fp.startsWith(upath.dirname(dp))
          })
        })
        .filter((fp) => {
          return fp !== OUTFILE
        })
        .map((fp) => {
          return fp.replace(/\.ts$/, '')
        })
        .sort()

      const relative = [
        ...exportDirpaths.map((dp) => {
          return upath.removeExt(dp, '.ts')
        }),
        ...exportFilepaths,
      ] //
        .map((fp) => {
          return fp.replace(/^src/, '.')
        })

      const lines = relative
        .flatMap((fp) => {
          return `export * from '${fp.replace(/\/index$/, '')}'`
        })
        .concat('')

      const wsPkgPath = upath.joinSafe(wsDirpath, 'package.json')
      const pkg = await fs.readJson(wsPkgPath)
      pkg.exports = {
        '.': './src/index.ts',
        ...Object.fromEntries(
          relative.map((fp) => {
            return [`./${upath.basename(fp.replace(/\/index$/, ''))}`, `${fp.replace('.', './src')}.ts`]
          })
        ),
      }
      await outputFileIfChanged(wsPkgPath, `${JSON.stringify(pkg, null, 2)}\n`, logger)

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
    { concurrency: 10 }
  )
}
