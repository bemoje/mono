import fs from 'fs-extra'
import { glob } from 'glob'
import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath'
import { importLibs } from './importLibs'
import { getNamedExportTsDocSummary } from './tsdoc'
import type { Logger } from '@mono/node'
import onetime from 'onetime'

export const parseLibsTsDocSummaries = onetime(async () => {
  const logActions: ((log: Logger | Console) => void)[] = []
  const printLogs = (log: Logger | Console = console) => {
    logActions.forEach((f) => f(log))
    logActions.length = 0
  }
  const logError = (...args: unknown[]) => logActions.push((log) => log.error(...args))
  const logInfo = (...args: unknown[]) => logActions.push((log) => log.info(...args))

  const libsModulesMap = await importLibs()

  const libs = Array.from(libsModulesMap.entries()).flatMap(([wsName, mod]) =>
    Object.keys(mod)
      .filter((s) => s !== 'default')
      .map((expName) => ['libs/' + wsName, expName]),
  )

  const exportsNotInDedicatedFileSet = new Set(libs.map(([wsPath, expName]) => wsPath + ' => ' + expName + '.ts'))

  const repoRoot = getRepoRootDirpath()
  const tsFiles = (await glob(['libs/*/src/**/*.ts'], { absolute: true }))
    .map((fp) => upath.relative(repoRoot, fp))
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
    }),
  )

  const summaries = new Map<string, string>()

  for (const { filepath, filename, code } of tsFilesAndContent) {
    const fileHasExport = libs.some(([wsPath, expName]) => {
      if (!(filepath.startsWith(wsPath + '/src/') && filepath.endsWith('/' + expName + '.ts'))) return
      exportsNotInDedicatedFileSet.delete(wsPath + ' => ' + expName + '.ts')
      summaries.set(filepath, '???')
      return true
    })

    if (!fileHasExport) continue

    const summary = getNamedExportTsDocSummary(filename, code) || '???'
    summaries.set(filepath, summary)
  }

  const filesNotDocumented = Array.from(summaries.entries())
    .map(([filepath, summary]) => ({ filepath, summary }))
    .filter((o) => o.summary === '???')
    .map((o) => o.filepath)
    .sort()

  if (filesNotDocumented.length) {
    logError(filesNotDocumented.length + ' named exports missing TSDoc in libs:')
    filesNotDocumented.forEach((filepath) => logError(' ' + filepath))
  } else {
    logInfo(filesNotDocumented.length + ' named exports missing TSDoc in libs.')
  }

  if (exportsNotInDedicatedFileSet.size) {
    logError(exportsNotInDedicatedFileSet.size + ' named exports without dedicated files:')
    Array.from(exportsNotInDedicatedFileSet)
      .sort()
      .forEach((s) => logError('  ' + s))
  } else {
    logInfo(exportsNotInDedicatedFileSet.size + ' named exports without dedicated files.')
  }

  const validSummaries = Array.from(summaries.entries())
    .map(([filepath, summary]) => ({ filepath, summary }))
    .filter((o) => o.summary !== '???')
    .sort((a, b) => a.filepath.localeCompare(b.filepath))

  logInfo(validSummaries.length + ` TSDoc summaries parsed in libs.`)

  return { validSummaries, exportsNotInDedicatedFileSet, filesNotDocumented, printLogs }
})
