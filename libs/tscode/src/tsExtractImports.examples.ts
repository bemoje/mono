import { tsExtractImports } from './tsExtractImports'
import { parseImportStatement } from './parseImportStatement'
import { globSync } from 'glob'
import fs from 'fs-extra'
import lodash from 'lodash-es'

example1()

function example1() {
  const fps = globSync('libs/*/src/**/*.ts') //
    .filter((p) => !/[./\\](test|wip|old|examples?|benchmark|temp|playground)[./\\]/.test(p))

  const entries = Object.entries(lodash.groupBy(fps, (p) => p.split(/[\\/]/)[1]))
    .map(([ws, fps]) => {
      const deps = new Set(
        fps
          .flatMap((p) => {
            const code = fs.readFileSync(p, 'utf8')
            return tsExtractImports(code)
          })
          .map((m) => parseImportStatement(m.matchOneLine))
          .filter((i) => i.modulePath.type !== 'relative')
          .filter((i) => i.modulePath.type === 'package')
          .filter((i) => i.modulePath.path.startsWith('@mono/'))
          .filter((i) => !i.modulePath.path.startsWith('@mono/types'))
          .map((i) => i.modulePath.path),
      )
      return ['@mono/' + ws, Array.from(deps).sort()]
    })
    .sort()
  console.log(Object.fromEntries(entries))
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
    .filter((m) => {
      return (
        !/^import ['"]/.test(m.matchOneLine) &&
        !/from ['"](path|fs|typescript|depcheck|extract-zip|stacktrace-parser)['"];?$/.test(m.matchOneLine) &&
        !/\} from ['"](node:)?(u?path|fs-extra|fs|child_process)/.test(m.matchOneLine)
      )
    })
    .map((m) => parseImportStatement(m.matchOneLine))
    .filter((i) => i.modulePath.type !== 'relative')
  // .filter((i) => !(i.modulePath.type === 'package' && i.modulePath.path.startsWith('@mono/')))

  console.log('---------')
  const result = Array.from(
    new Set(
      lodash
        .sortBy(
          p.flatMap((i) => i.splitBySpecifier({ unaliasNamedImports: true })),
          (a) => a.modulePath.path,
        )
        .map((i) => i.modulePath.path),
    ),
  )
  console.log(result.join('\n'))
  console.log('---------')
  const names = Array.from(new Set(p.flatMap((i) => i.getNames({ unaliasNamedImports: true })))).sort()
  console.log('---------')
  console.log('result:', result.length)
  console.log('names:', names.length)
}
