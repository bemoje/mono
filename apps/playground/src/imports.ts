import { DefaultMap } from 'mnemonist'
import { ExtMap } from '@mono/map'
import { MultiSet } from 'mnemonist'
import cp from 'child_process'
import fs from 'fs-extra'
import { globSync } from 'glob'
import { reduce } from 'iter-tools'
import { tsExtractImports } from '@mono/tscode'

function parseNameFromImportStatement(line: string): string {
  return line
    .replace(/import /, '')
    .replace(/ from '.*$/, '')
    .replace('* as ', '')
    .replace(/[{}]/g, '')
    .trim()
}

function isRelativeImport(line: string) {
  return / from '[.]/.test(line)
}
function isOtherRepoOwnPath(line: string) {
  return /from '@(dn|bmj|bemoje|rfmain|mono)[/]/.test(line)
}

const defaultImports = new DefaultMap<string, MultiSet<string>>(() => {
  return new MultiSet()
})

// const lines = globSync('{mono,tsmono,dn,ts}/{libs,apps,packages}/*/src/**/*.ts', {
//   cwd: 'C:/Users/bemoj/repos',
//   absolute: true,
// })
const lines = globSync('{libs,apps,packages}/*/src/**/*.ts')
  .filter((p) => {
    return !/[./\\](test|wip|old|examples?|benchmark|temp)[./\\]/.test(p)
  })
  .flatMap((p) => {
    const code = fs.readFileSync(p, 'utf8')
    const imports = tsExtractImports(code)
    return imports
      .map((imp) => {
        return imp.matchOneLine
          .replace(/"/g, "'")
          .replace(/;$/, '')
          .replace(/\s{2,}/g, ' ')
      })
      .filter((line) => {
        return (
          line.includes(' from ')
          && !isRelativeImport(line)
          && !isOtherRepoOwnPath(line)
          && !line.includes("from 'lodash/")
          && !line.includes("from 'mnemonist/")
        )
      })
      .map((imp) => {
        return imp
          .replace(/[*] as /, '')
          .replace(/ as [^\s]+ /g, '')
          .replace(/type /g, '')
          .replace("from 'ms'", "from 'enhanced-ms'")
          .replace("from '@commander-js/extra-typings'", "from 'commander'")
          .replace("from 'node:fs'", "from 'fs-extra'")
          .replace("from 'node:path'", "from 'upath'")
          .replace(/ fse from 'fs-extra'/, " fs from 'fs-extra'")
          .replace(" path from 'upath'", " upath from 'upath'")
          .replace(" ems from 'enhanced-ms'", " ms from 'enhanced-ms'")
          .replace(" child_process from 'child_process'", " cp from 'child_process'")
          .replace(" path from '@mono/path'", " mpath from '@mono/path'")
          .replace(/\s{2,}/g, ' ')
      })
      .sort((a, b) => {
        return (
          b.includes('{') && !a.includes('{') ? -1
          : b.includes('{') ? 1
          : 0
        )
      })
      .flatMap((line) => {
        const strImp = 'import '
        const [specifiers, modulePath] = line.replace(strImp, '').split(' from ')
        if (!line.includes('{')) {
          const name = parseNameFromImportStatement(line)
          const tempName = `__${modulePath.replace(/['"@/]/g, '').replace(/-/g, '_')}`
          const tempLine = line.replace(name, tempName)
          defaultImports.get(tempLine).add(line)
          return [tempLine]
        }
        return specifiers
          .replace(/import /, '')
          .replace(/[{}]/g, '')
          .split(',')
          .map((s) => {
            return s.trim()
          })
          .filter(Boolean)
          .map((specifier) => {
            return `${strImp}{ ${specifier} } from ${modulePath}`
          })
      })
  })
  .map((line) => {
    if (!defaultImports.has(line)) {
      return line
    }
    return Array.from(defaultImports.get(line).multiplicities()).sort((a, b) => {
      return b[1] - a[1]
    })[0][0]
  })
  .concat(...cp.execSync(`yarn devkit imports statements`).toString().trim().split('\n'))

const counts = countUniques(lines)

const nameToStatementMap = new Map<string, string>()

counts.keysArray().forEach((line) => {
  const name = parseNameFromImportStatement(line)
  if (!nameToStatementMap.has(name)) {
    nameToStatementMap.set(name, line)
  }
})

const _result = Array.from(nameToStatementMap.values()).flat().reverse()
const defaults = _result.filter((line) => {
  return !line.includes('{')
})
const named = _result.filter((line) => {
  return line.includes('{')
})

const result = [...named, ...defaults]

result.forEach((p) => {
  return console.log(p)
})

// console.log([...nameToStatementMap.keys()])
console.log()

console.log('lines', lines.length)
console.log('nameToStatementMap', nameToStatementMap.size)
console.log('result', result.length)

/**
 * Count unique occurrences of values in an iterable, returning a sorted map by count descending.
 */
function countUniques<V>(arr: Iterable<V>) {
  return new ExtMap<V, number>(
    reduce(
      new MultiSet<V>(), //
      (acc, imp) => {
        return acc.add(imp)
      },
      arr
    ).multiplicities()
  ).sortByValues((a, b) => {
    return b - a
  })
}
