import type { Logger } from '@mono/node'
import fs from 'fs-extra'
import { getNamedExportTsDocSummary } from './tsdoc'
import { getRepoRootDirpath } from './getRepoRootDirpath'
import { glob } from 'glob'
import { importLibs } from './importLibs'
import { once } from 'es-toolkit'
import upath from 'upath'

export const parseLibsTsDocSummaries = once(async () => {
  const logActions: ((log: Logger | Console) => void)[] = []
  const printLogs = (log: Logger | Console = console) => {
    logActions.forEach((f) => {
      return f(log)
    })
    logActions.length = 0
  }
  const logError = (...args: unknown[]) => {
    return logActions.push((log) => {
      return log.error(...args)
    })
  }
  const logInfo = (...args: unknown[]) => {
    return logActions.push((log) => {
      return log.info(...args)
    })
  }

  const libsModulesMap = await importLibs()

  const libs = Array.from(libsModulesMap.entries()).flatMap(([wsName, mod]) => {
    return Object.keys(mod)
      .filter((s) => {
        return s !== 'default'
      })
      .map((expName) => {
        return [`libs/${wsName}`, expName]
      })
  })

  const exportsNotInDedicatedFileSet = new Set(
    libs.map(([wsPath, expName]) => {
      return `${wsPath} => ${expName}.ts`
    })
  )

  const repoRoot = getRepoRootDirpath()
  const tsFiles = (await glob(['libs/*/src/**/*.ts'], { absolute: true }))
    .map((fp) => {
      return upath.relative(repoRoot, fp)
    })
    .filter(Boolean)

  if (tsFiles.length === 0) {
    logError('⚠️ No TypeScript files found.')
    return { validSummaries: [], exportsNotInDedicatedFileSet, filesNotDocumented: [], printLogs }
  }

  const tsFilesAndContent = await Promise.all(
    tsFiles.map(async (filepath) => {
      const filename = upath.trimExt(upath.basename(filepath))
      const code = await fs.readFile(filepath, 'utf8')
      return { filepath, filename, code }
    })
  )

  const summaries = new Map<string, string>()

  for (const { filepath, filename, code } of tsFilesAndContent) {
    const fileHasExport = libs.some(([wsPath, expName]) => {
      if (code.includes(`// @ignore missing-tsdoc-files`)) {
        exportsNotInDedicatedFileSet.delete(`${wsPath} => ${expName}.ts`)
      }
      if (!(filepath.startsWith(`${wsPath}/src/`) && filepath.endsWith(`/${expName}.ts`))) {
        return
      }
      exportsNotInDedicatedFileSet.delete(`${wsPath} => ${expName}.ts`)
      summaries.set(filepath, '???')
      return true
    })

    if (!fileHasExport) {
      continue
    }

    const summary = getNamedExportTsDocSummary(filename, code) || '???'
    summaries.set(filepath, summary)
  }

  const filesNotDocumented = Array.from(summaries.entries())
    .map(([filepath, summary]) => {
      return { filepath, summary }
    })
    .filter((o) => {
      return o.summary === '???'
    })
    .map((o) => {
      return o.filepath
    })
    .sort()

  if (filesNotDocumented.length) {
    logError(`${filesNotDocumented.length} named exports missing TSDoc in libs:`)
    filesNotDocumented.forEach((filepath) => {
      return logError(` ${filepath}`)
    })
  } else {
    logInfo(`${filesNotDocumented.length} named exports missing TSDoc in libs.`)
  }

  if (exportsNotInDedicatedFileSet.size) {
    logError(`${exportsNotInDedicatedFileSet.size} named exports without dedicated files:`)
    Array.from(exportsNotInDedicatedFileSet)
      .sort()
      .forEach((s) => {
        return logError(`  ${s}`)
      })
  } else {
    logInfo(`${exportsNotInDedicatedFileSet.size} named exports without dedicated files.`)
  }

  const validSummaries = Array.from(summaries.entries())
    .map(([filepath, summary]) => {
      return { filepath, summary }
    })
    .filter((o) => {
      return o.summary !== '???'
    })
    .sort((a, b) => {
      return a.filepath.localeCompare(b.filepath)
    })

  logInfo(`${validSummaries.length} TSDoc summaries parsed in libs.`)

  return { validSummaries, exportsNotInDedicatedFileSet, filesNotDocumented, printLogs }
})
