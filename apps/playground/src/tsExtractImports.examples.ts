import { ImportStatement } from '@mono/tscode'
import fs from 'fs-extra'
import { globSync } from 'glob'
import { groupBy } from 'es-toolkit/array'
import { mapObject } from '@mono/object'
import { parseImportStatement } from '@mono/tscode'
import { sortBy } from 'es-toolkit/compat'
import { tsExtractImports } from '@mono/tscode'

example1()
example2

function example1() {
  const repoLibScope = '@mono'
  const isTestFile = (p: string) => {
    return p.endsWith('.test.ts')
  }
  const isWorkspacePath = (p: string) => {
    return p.startsWith(`${repoLibScope}/`)
  }
  const getWsDirname = (p: string) => {
    return p.split(/[\\/]/)[1]
  }
  const getImportType = (i: ImportStatement) => {
    return i.modulePath.type
  }
  const toSortedModulePaths = (arr: ImportStatement[]) => {
    return Array.from(
      new Set(
        arr.map((i) => {
          return i.modulePath.path
        }),
      ),
    ).sort()
  }

  const fps = globSync('libs/*/src/**/*.ts').filter((p) => {
    return !isTestFile(p)
  })
  const entries = Object.entries(groupBy(fps, getWsDirname)).map(([ws, fps]) => {
    const arr = fps
      .flatMap((p) => {
        return tsExtractImports(fs.readFileSync(p, 'utf8'))
      })
      .map((m) => {
        return parseImportStatement(m.matchOneLine, { isWorkspacePath })
      })
      .filter((i) => {
        return i.modulePath.type !== 'relative'
      })
    const wsName = `${repoLibScope}/${ws}`
    const depsByType = mapObject(groupBy(arr, getImportType), toSortedModulePaths)
    return [wsName, depsByType] as const
  })

  console.log(new Map(entries.sort()))
}

function example2() {
  const lines = globSync('{libs,apps,packages}/*/src/**/*.ts')
    .filter((p) => {
      return !p.endsWith('index.ts')
    })
    .filter((p) => {
      return !/[./\\](test|wip|old|examples?|benchmark|temp|playground)[./\\]/.test(p)
    })
    .map((p) => {
      const code = fs.readFileSync(p, 'utf8')
      return tsExtractImports(code)
        .map((m) => {
          return m.matchOneLine
        })
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
    .map((m) => {
      return parseImportStatement(m.matchOneLine)
    })
    .filter((i) => {
      return i.modulePath.type !== 'relative'
    })
  // .filter((i) => !(i.modulePath.type === 'package' && i.modulePath.path.startsWith('@mono/')))

  console.log('---------')
  const result = Array.from(
    new Set(
      sortBy(
        p.flatMap((i) => {
          return i.splitBySpecifier({ unaliasNamedImports: true })
        }),
        (a) => {
          return a.modulePath.path
        },
      ).map((i) => {
        return i.modulePath.path
      }),
    ),
  )
  console.log(result.join('\n'))
  console.log('---------')
  const names = Array.from(
    new Set(
      p.flatMap((i) => {
        return i.getNames({ unaliasNamedImports: true })
      }),
    ),
  ).sort()
  console.log('---------')
  console.log('result:', result.length)
  console.log('names:', names.length)
}
