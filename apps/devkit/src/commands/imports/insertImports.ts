import { Command } from 'commander'
import { MonoRepo } from '@mono/monorepo'
import fs from 'fs-extra'
import strip from 'strip-comments'
import { tsExtractImports, tsSortImports } from '@mono/tscode'

export function insertImports() {
  return new Command('insertImports')
    .alias('ii')
    .argument('<filepath>', 'Insert imports at path')
    .option('-a, --all', 'Insert all imports')
    .action(async (filepath, options) => {
      const origCode = fs.readFileSync(filepath, 'utf-8')
      let noComments = strip(origCode)
      const newImports = new MonoRepo().topImports(50000).map((o) => o.code)

      const getImportedNames = (importLine: string) => {
        return importLine
          .replace(/^import /, '')
          .replace(/ from '.*$/, '')
          .replace(/[\w*]+ as \w+/, (m) => m.split(' as ')[1] || '')
          .replace(/[{}]/g, ' ')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      }

      const getRegexes = (name: string) => {
        const regexHasImport = new RegExp('import .*\\b' + name + '\\b', 's')
        const regexIsExport = new RegExp('^export .*\\b' + name + '\\b', 'm')
        return { regexHasImport, regexIsExport }
      }

      const p1 = newImports.filter((importLine) => {
        const imports = tsExtractImports(noComments)
        const codeAfterImports = imports.reduce((acc, imp) => acc.replace(imp.match, ''), noComments)
        const impOneLiners = imports.map((imp) => imp.match.replace(/\n/, ' ').trim()).join('\n')
        const importedNames = getImportedNames(importLine)

        const shouldInsert = importedNames.some((name) => {
          const { regexHasImport, regexIsExport } = getRegexes(name)
          const regexIsReferenced = new RegExp('[^.]\\b' + name + '\\b')
          return (
            importLine.includes(' from ') &&
            !regexHasImport.test(impOneLiners) &&
            !regexIsExport.test(noComments) &&
            regexIsReferenced.test(codeAfterImports)
          )
        })

        if (shouldInsert) {
          noComments = importLine + '\n' + noComments
          return true
        }
      })

      const p2 = options?.all
        ? newImports.filter((importLine) => {
            if (p1.includes(importLine)) return false
            const imports = tsExtractImports(noComments)
            const impOneLiners = imports.map((imp) => imp.match.replace(/\n/, ' ').trim()).join('\n')
            const importedNames = getImportedNames(importLine)

            const shouldInsert = importedNames.some((name) => {
              const { regexHasImport, regexIsExport } = getRegexes(name)
              return (
                importLine.includes(' from ') &&
                !regexHasImport.test(impOneLiners) &&
                !regexIsExport.test(noComments)
              )
            })

            if (shouldInsert) {
              noComments = importLine + '\n' + noComments
              return true
            }
          })
        : []

      const newCode = tsSortImports(p1.concat(p2).join('\n') + '\n\n' + origCode).replace(
        /\n\nimport/g,
        '\nimport',
      )
      fs.outputFileSync(filepath, newCode)
    })
}
