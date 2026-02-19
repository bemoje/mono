import fs from 'fs-extra'
import cp from 'node:child_process'
import { glob } from 'glob'
import upath from 'upath'
import colors from 'ansi-colors'
import { getRepoRootDirpath } from './getRepoRootDirpath'
import { getRepoPackageJson } from './getRepoPackageJson'
import { importLibs } from './importLibs'
import { getNamedExportTsDocSummary } from './tsdoc'
import { arrayTableToMarkdown } from './arrayTableToMarkdown'
import { getLinesOfCode } from './getLinesOfCode'
import type { Logger } from '@mono/node'

export const README_TEMPLATE_PATH = 'docs/readmeTemplate.md'

/**
 * Renders the full README content.
 */
export async function renderReadme(): Promise<string> {
  cp.execSync('yarn prettier -w --l ' + README_TEMPLATE_PATH, { stdio: 'inherit' })

  let md = await fs.readFile(README_TEMPLATE_PATH, 'utf8')

  md = md.replace('<!-- REPO_NAME -->', await getRepoName())
  md = md.replace('<!-- REPO_DESCRIPTION -->', await getRepoDescription())
  md = md.replace('<!-- LINES_OF_CODE_TABLE -->', await renderLinesOfCodeTable())
  md = md.replace('<!-- LIBS_COVERAGE_SUMMARY_TABLE -->', await renderCoverageSummary())
  md = md.replace('<!-- LIBRARY_EXPORTED_MODULES -->', await renderLibsExportedModules())
  md = md.replace('<!-- TOC_TABLE -->', await renderTOC(md))

  const descriptions = await getNpmPkgDescriptions([
    ['<!-- ES_TOOLKIT_INFO -->', 'es-toolkit'],
    ['<!-- ITER_TOOLS_INFO -->', 'iter-tools'],
    ['<!-- TYPE_FEST_INFO -->', 'type-fest'],
    ['<!-- UPATH_INFO -->', 'upath'],
    ['<!-- FS_EXTRA_INFO -->', 'fs-extra'],
    ['<!-- ANSI_COLORS_INFO -->', 'ansi-colors'],
  ])
  descriptions.forEach(({ placeholder, description }: { placeholder: string; description: string }) => {
    md = md.replace(placeholder, description)
  })

  return md
}

export async function renderTOC(readmeMarkdown: string): Promise<string> {
  return readmeMarkdown
    .replace(/\n```\w+\n[^`]+\n```\n/gs, '\n')
    .split('\n')
    .filter((line) => /^#+ /.test(line))
    .map((line) => {
      const level = line.match(/^#+/)![0].length
      const indent = '  '.repeat(level - 1)
      const title = line.replace(/^#+ /, '').trim()
      const id = line
        .replace(/^#+ /, '')
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z-0-9]/gi, '')
      return `${indent}- [${title}](#${id})`
    })
    .join('\n')
}

export async function renderLibsExportedModules(): Promise<string> {
  const { validSummaries } = await parseLibsTsDocSummaries()

  const libsModulesMap = await importLibs()

  const librarySummaries = new Map<string, { fileName: string; functionName: string; summary: string }[]>()

  for (const { filepath, summary } of validSummaries) {
    try {
      const regex = /^libs\/([^/]+)\/src\/(.+)\.ts$/
      const match = filepath.match(regex)
      if (!match) continue
      const [libName, fileName] = match.slice(1)
      if (libName === 'module.exports') continue
      if (!librarySummaries.has(libName)) {
        librarySummaries.set(libName, [])
      }
      librarySummaries.get(libName)!.push({
        fileName,
        functionName: upath.basename(fileName),
        summary: summary || 'No description available',
      })
    } catch {
      continue
    }
  }

  const sortedLibNames = Array.from(librarySummaries.keys()).sort()
  const libExports: string[] = []

  for (const libName of sortedLibNames) {
    const libModule = libsModulesMap.get(libName)
    if (!libModule) continue

    const namedExports = Object.keys(libModule)
      .filter((name) => name !== 'default')
      .sort()

    if (namedExports.length === 0) continue

    libExports.push(`**${libName}**`)

    const summaries = librarySummaries.get(libName) || []
    const summaryMap = new Map(summaries.map((s) => [s.functionName, s.summary]))

    for (const exportName of namedExports) {
      const summary = summaryMap.get(exportName) || '?'
      libExports.push(`- \`${exportName}\`: ${summary}`)
    }

    libExports.push('')
  }
  return libExports.join('\n')
}

export async function getNpmPkgDescription(name: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cp.exec(`npm view ${name} description`, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout.toString().split('\n')[0].trim())
    })
  })
}

export async function getRepoDescription(): Promise<string> {
  return (await getRepoPackageJson()).description
}

export async function getRepoName(): Promise<string> {
  return (await getRepoPackageJson()).name
}

let _cachedSummaries: Awaited<ReturnType<typeof _parseLibsTsDocSummaries>> | undefined

export async function parseLibsTsDocSummaries() {
  if (_cachedSummaries) return _cachedSummaries
  _cachedSummaries = await _parseLibsTsDocSummaries()
  return _cachedSummaries
}

async function _parseLibsTsDocSummaries() {
  const logActions: ((log: Logger | Console) => void)[] = []
  const printLogs = (log: Logger | Console = console) => {
    logActions.forEach((f) => f(log))
    logActions.length = 0
  }
  const warn = (...args: unknown[]) => logActions.push((log) => log.warn(...args))
  const info = (...args: unknown[]) => logActions.push((log) => log.info(...args))

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
    warn('⚠️ No TypeScript files found.')
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
    warn(filesNotDocumented.length, 'named exports missing TSDoc in libs:')
    filesNotDocumented.forEach((filepath) => warn(' ' + colors.gray(filepath)))
  } else {
    info(filesNotDocumented.length, 'named exports missing TSDoc in libs.')
  }

  if (exportsNotInDedicatedFileSet.size) {
    warn(exportsNotInDedicatedFileSet.size, 'named exports without dedicated files:')
    Array.from(exportsNotInDedicatedFileSet)
      .sort()
      .forEach((s) => warn(' ' + colors.gray(s)))
  } else {
    info(exportsNotInDedicatedFileSet.size, 'named exports without dedicated files.')
  }

  const validSummaries = Array.from(summaries.entries())
    .map(([filepath, summary]) => ({ filepath, summary }))
    .filter((o) => o.summary !== '???')
    .sort((a, b) => a.filepath.localeCompare(b.filepath))

  info(validSummaries.length, `TSDoc summaries parsed in libs.`)

  return { validSummaries, exportsNotInDedicatedFileSet, filesNotDocumented, printLogs }
}

export async function renderCoverageSummary(): Promise<string> {
  const coverageJsonPath = '.coverage/html/coverage-summary.json'
  const coverageData = await fs.readJson(coverageJsonPath)
  const { total } = coverageData

  return arrayTableToMarkdown([
    ['Metric', 'Total', 'Covered', 'Percentage'],
    ['Lines', total.lines.total, total.lines.covered, `${total.lines.pct}%`].map(String),
    ['Functions', total.functions.total, total.functions.covered, `${total.functions.pct}%`].map(String),
    ['Branches', total.branches.total, total.branches.covered, `${total.branches.pct}%`].map(String),
  ])
}

export async function getNpmPkgDescriptions(placeholders: [string, string][]) {
  return await Promise.all(
    placeholders.map(async ([placeholder, name]) => ({
      placeholder,
      name,
      description: await getNpmPkgDescription(name),
    })),
  )
}

export async function renderLinesOfCodeTable(): Promise<string> {
  const counts = await getLinesOfCode()
  return arrayTableToMarkdown([
    ['file type', 'files', 'lines of code'],
    ...Object.entries(counts).map(([k, v]) => [k, String(v.files), String(v.lines)]),
  ])
}
