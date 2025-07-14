// parse-tsdoc.mjs
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'
import ts from 'typescript'
import { TSDocParser } from '@microsoft/tsdoc'
import { glob } from 'glob'
import fs from 'fs-extra'
import upath from 'upath'
import { importLibs } from './importLibs.mjs'

export async function parseTsDocs() {
  const tsdocParser = new TSDocParser()
  const summaries = new Map()

  const libs = Array.from((await importLibs()).entries()).flatMap(([wsName, mod]) =>
    Object.keys(mod)
      .filter((s) => s !== 'default')
      .map((expName) => ['libs/' + wsName, expName]),
  )

  const libExportNotInDedicatedFileSet = new Set(
    libs.map(([wsPath, expName]) => wsPath + ' => ' + expName + '.ts'),
  )

  async function processFile(filePath) {
    const sourceText = await fs.readFile(filePath, 'utf8')
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true)

    const fileHasExport = libs.some(([wsPath, expName]) => {
      if (!(filePath.startsWith(wsPath + '/src/') && filePath.endsWith('/' + expName + '.ts'))) return false
      libExportNotInDedicatedFileSet.delete(wsPath + ' => ' + expName + '.ts')
      summaries.set(filePath, '???')
      return true
    })

    if (!fileHasExport) return

    function recurse(node) {
      const comments = ts.getLeadingCommentRanges(sourceText, node.pos)
      for (const comment of comments ?? []) {
        const commentText = sourceText.slice(comment.pos, comment.end)

        if (commentText.startsWith('/**')) {
          const parserContext = tsdocParser.parseString(commentText)
          const docComment = parserContext.docComment

          const summary = docComment.summarySection
            .getChildNodes()
            .flatMap((node) => {
              return node
                .getChildNodes()
                .flatMap((child) => {
                  return child._text
                })
                .filter(Boolean)
            })
            .filter(Boolean)
            .join(' ')
            .split(/\n|\. /)[0]
            .trim()

          if (summary) {
            summaries.set(filePath, summary)
          }
        }
      }

      // recurse
      ts.forEachChild(node, recurse)
    }

    recurse(sourceFile)
  }

  const repoRoot = getRepoRootDirpath()
  const tsFiles = (await glob(['libs/*/src/**/*.ts'], { absolute: true }))
    .map((fp) => upath.relative(repoRoot, fp))
    .filter(Boolean)
  // .filter((filePath) => {
  //   return libs.some(([wsPath, expName]) => {
  //     if (!(filePath.startsWith(wsPath + '/src/') && filePath.endsWith('/' + expName + '.ts'))) return false
  //     libExportsWithoutDedicatedFile.delete(wsPath + ' => ' + expName + '.ts')
  //     return true
  //   })
  // })

  if (tsFiles.length === 0) {
    console.warn('⚠️ No TypeScript files found.')
    return
  }

  for (const filePath of tsFiles) {
    await processFile(filePath)
  }

  const filesSummaries = Array.from(summaries.entries())
    .map(([filepath, summary]) => {
      return { filepath, summary }
    })
    .filter((o) => o.summary !== '???')
    .sort((a, b) => a.filepath.localeCompare(b.filepath))

  const filesSummariesMissing = Array.from(summaries.entries())
    .map(([filepath, summary]) => {
      return { filepath, summary }
    })
    .filter((o) => o.summary === '???')
    .map((o) => o.filepath)
    .sort()

  const libExportNotInDedicatedFile = Array.from(libExportNotInDedicatedFileSet).sort()

  return {
    filesSummaries,
    filesSummariesMissing,
    libExportNotInDedicatedFile,
  }
}
