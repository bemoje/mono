import { ImportStatement } from "@mono/tscode";
import { tsExtractImports } from "@mono/tscode";
import { parseImportStatement } from '@mono/tscode'
import { globSync } from 'glob'
import fs from 'fs-extra'
import { groupBy } from 'es-toolkit/array'
import { sortBy } from 'es-toolkit/compat'
import { mapObject } from '@mono/object'

example1()
example2

function example1() {
  const repoLibScope = '@mono'
  const isTestFile = (p: string) => p.endsWith('.test.ts')
  const isWorkspacePath = (p: string) => p.startsWith(repoLibScope + '/')
  const getWsDirname = (p: string) => p.split(/[\\/]/)[1]
  const getImportType = (i: ImportStatement) => i.modulePath.type
  const toSortedModulePaths = (arr: ImportStatement[]) => {
    return Array.from(new Set(arr.map((i) => i.modulePath.path))).sort()
  }

  const fps = globSync('libs/*/src/**/*.ts').filter((p) => !isTestFile(p))
  const entries = Object.entries(groupBy(fps, getWsDirname)).map(([ws, fps]) => {
    const arr = fps
      .flatMap((p) => tsExtractImports(fs.readFileSync(p, 'utf8')))
      .map((m) => parseImportStatement(m.matchOneLine, { isWorkspacePath }))
      .filter((i) => i.modulePath.type !== 'relative')
    const wsName = repoLibScope + '/' + ws
    const depsByType = mapObject(groupBy(arr, getImportType), toSortedModulePaths)
    return [wsName, depsByType] as const
  })

  console.log(new Map(entries.sort()))
}

function example2() {
  const lines = globSync('{libs,apps,packages}/*/src/**/*.ts')
    .filter((p) => !p.endsWith('index.ts'))
    .filter((p) => !/[./\\](test|wip|old|examples?|benchmark|temp|playground)[./\\]/.test(p))
    .map((p) => {
      const code = fs.readFileSync(p, 'utf8')
      return tsExtractImports(code)
        .map((m) => m.matchOneLine)
        .join('\n')
    })

    .join('\n\n')

  const p = tsExtractImports(lines)
    // .filter((m) => {
    //   return (
    //     !/^import ['"]/.test(m.matchOneLine) &&
    //     !/from ['"](path|fs|typescript|depcheck|extract-zip|stacktrace-parser)['"];?$/.test(m.matchOneLine) &&
    //     !/\} from ['"](node:)?(u?path|fs-extra|fs|child_process)/.test(m.matchOneLine)
    //   )
    // })
    .map((m) => parseImportStatement(m.matchOneLine))
    .filter((i) => i.modulePath.type !== 'relative')
  // .filter((i) => !(i.modulePath.type === 'package' && i.modulePath.path.startsWith('@mono/')))

  console.log('---------')
  const result = Array.from(
    new Set(
      sortBy(
        p.flatMap((i) => i.splitBySpecifier({ unaliasNamedImports: true })),
        (a) => a.modulePath.path,
      ).map((i) => i.modulePath.path),
    ),
  )
  console.log(result.join('\n'))
  console.log('---------')
  const names = Array.from(new Set(p.flatMap((i) => i.getNames({ unaliasNamedImports: true })))).sort()
  console.log('---------')
  console.log('result:', result.length)
  console.log('names:', names.length)
}
