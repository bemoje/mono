import type { Logger } from '@mono/node'
import upath from 'upath'
import { glob } from 'glob'
import { getRepoRootDirpath } from '../lib/getRepoRootDirpath'
import { outputFileIfChanged } from '../lib/outputFileIfChanged'
import { forEachAsync } from 'es-toolkit'
import fs from 'fs-extra'

export async function fixIndexTsAction(
  dirnames: string[],
  opts: { ignore?: string[] },
  { logger }: { logger: Logger },
) {
  const repoRoot = getRepoRootDirpath()

  const libWorkspacePaths = (dirnames.length ? dirnames : await fs.readdir('libs'))
    .filter((dirname) => !opts.ignore || !opts.ignore.includes(dirname))
    .map((d) => upath.joinSafe('libs', d))

  await forEachAsync(
    libWorkspacePaths,
    async (wsPath) => {
      const OUTFILE = 'src/index.ts'
      const TEST_OUTFILE = 'src/index.test.ts'
      const WS_ROOT = upath.joinSafe(repoRoot, wsPath)

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

      const relative = [...exportDirpaths, ...exportFilepaths] //
        .map((fp) => fp.replace(/^src/, '.'))

      const tempName = (i: number) => {
        return 'MODULE_' + String(i + 1).padStart(relative.length.toString().length, '0')
      }

      let lines = relative.flatMap((fp) => `export * from '${fp}'`).concat('')

      const tsconfig = {
        ...(await fs.readJson(upath.joinSafe(repoRoot, 'tsconfig.json'), 'utf8')),
        ...(await fs.readJson(upath.joinSafe(wsPath, 'tsconfig.json'), 'utf8')),
      }

      if (!tsconfig.compilerOptions.isolatedDeclarations) {
        lines = lines.concat(
          relative.map((fp, i) => {
            return `import * as ${tempName(i)} from '${fp}'`
          }),
          '', //
          `export default {`,
          ...relative.map((_, i) => `  ...${tempName(i)},` + (i === 0 ? ' //' : '')),
          `}`,
          '',
        )
      }

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

      await outputFileIfChanged(upath.joinSafe(WS_ROOT, OUTFILE), lines.join('\n'), logger)
      await outputFileIfChanged(upath.joinSafe(WS_ROOT, TEST_OUTFILE), testLines.join('\n'), logger)
    },
    { concurrency: 10 },
  )
}
