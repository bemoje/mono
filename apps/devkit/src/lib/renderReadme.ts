import type { Logger } from '@mono/node'
import { arrayTableToMarkdown } from './arrayTableToMarkdown'
import cp from 'child_process'
import fs from 'fs-extra'
import { getLinesOfCode } from './getLinesOfCode'
import { getRepoPackageJson } from './getRepoPackageJson'
import { importLibs } from './importLibs'
import { outputFileIfChanged } from './outputFileIfChanged'
import { parseLibsTsDocSummaries } from './parseLibsTsDocSummaries'
import upath from 'upath'

export const README_TEMPLATE_PATH = 'docs/readmeTemplate.md'

/**
 * Renders the full README content.
 */
export async function renderReadme({ logger: log }: { logger: Logger }): Promise<string> {
  let md = await fs.readFile(README_TEMPLATE_PATH, 'utf8')

  const [repoName, repoDescription, linesOfCodeTable, coverageSummary, libsExportedModules] = await Promise.all([
    getRepoName(),
    getRepoDescription(),
    renderLinesOfCodeTable(),
    renderCoverageSummary(),
    renderLibsExportedModules({ logger: log }),
  ])

  md = md.replace('<!-- REPO_NAME -->', repoName)
  md = md.replace('<!-- REPO_DESCRIPTION -->', repoDescription)
  md = md.replace('<!-- LINES_OF_CODE_TABLE -->', linesOfCodeTable)
  md = md.replace('<!-- LIBS_COVERAGE_SUMMARY_TABLE -->', coverageSummary)
  md = md.replace('<!-- LIBRARY_EXPORTED_MODULES -->', libsExportedModules)

  const toc = await renderTOC(md)
  md = md.replace('<!-- TOC_TABLE -->', toc)

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
    .replaceAll(/\n```\w+\n[^`]+\n```\n/gs, '\n')
    .split('\n')
    .filter((line) => {
      return /^#+ /.test(line)
    })
    .map((line) => {
      const level = line.match(/^#+/)![0].length
      const indent = '  '.repeat(level - 1)
      const title = line.replace(/^#+ /, '').trim()
      const id = line
        .replace(/^#+ /, '')
        .toLowerCase()
        .replaceAll(' ', '-')
        .replaceAll(/[^\da-z-]/gi, '')
      return `${indent}- [${title}](#${id})`
    })
    .join('\n')
}

export async function renderLibsExportedModules({ logger: log }: { logger: Logger }): Promise<string> {
  const { validSummaries } = await parseLibsTsDocSummaries()

  const libsModulesMap = await importLibs()

  const librarySummaries = new Map<string, { fileName: string; functionName: string; summary: string }[]>()

  for (const { filepath, summary } of validSummaries) {
    try {
      const regex = /^libs\/([^/]+)\/src\/(.+)\.ts$/
      const match = filepath.match(regex)
      if (!match) {
        continue
      }
      const [libName, fileName] = match.slice(1)
      if (libName === 'module.exports') {
        continue
      }
      if (!librarySummaries.has(libName)) {
        librarySummaries.set(libName, [])
      }
      librarySummaries
        .get(libName)!
        .push({ fileName, functionName: upath.basename(fileName), summary: summary || 'No description available' })
    } catch {
      continue
    }
  }

  const sortedLibNames = Array.from(librarySummaries.keys()).sort()
  const libsExports: string[] = []

  for (const libName of sortedLibNames) {
    const libModule = libsModulesMap.get(libName)
    if (!libModule) {
      continue
    }

    const namedExports = Object.keys(libModule)
      .filter((name) => {
        return name !== 'default'
      })
      .sort()

    if (namedExports.length === 0) {
      continue
    }

    libsExports.push(
      `- [**libs/${libName}**](./libs/${libName}/README.md): ${
        (await fs.readJson(`libs/${libName}/package.json`)).description
      }`
    )

    const summaries = librarySummaries.get(libName) || []
    const summaryMap = new Map(
      summaries.map((s) => {
        return [s.functionName, s.summary]
      })
    )
    libsModulesMap.get(libName)
    const libExports: string[] = []

    for (const exportName of namedExports) {
      const filepath =
        validSummaries.find((o) => {
          return o.filepath.endsWith(`${exportName}.ts`)
        })?.filepath ?? `libs/${libName}/src/index.ts`
      const summary = summaryMap.get(exportName) || '?'
      libExports.push(`- [**${exportName}**](${filepath.replace(`libs/${libName}`, '.')}): ${summary}`)
    }

    const libReadme = await fs.readFile(`libs/${libName}/README.md`, 'utf8')
    const libReadmeLines = libReadme.split('\n')
    const exportsSectionStartIndex = libReadmeLines.indexOf('<!-- EXPORTS_START -->') + 1
    const exportsSectionEndIndex = libReadmeLines.indexOf('<!-- EXPORTS_END -->') - 1
    if (exportsSectionStartIndex === -1 || exportsSectionEndIndex === -1) {
      throw new Error(`EXPORTS_START or EXPORTS_END marker not found in libs/${libName}/README.md`)
    }
    libReadmeLines.splice(
      exportsSectionStartIndex,
      exportsSectionEndIndex - exportsSectionStartIndex + 1,
      '',
      ...libExports,
      ''
    )

    await outputFileIfChanged(`libs/${libName}/README.md`, libReadmeLines.join('\n'), log)
  }
  return libsExports.join('\n')
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

export async function renderCoverageSummary(): Promise<string> {
  const coverageJsonPath = '.coverage/html/coverage-summary.json'
  if (!fs.existsSync(coverageJsonPath)) {
    throw new Error('Coverage summary not found. Please run "yarn test-coverage" first.')
  }
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
    placeholders.map(async ([placeholder, name]) => {
      return { placeholder, name, description: await getNpmPkgDescription(name) }
    })
  )
}

export async function renderLinesOfCodeTable(): Promise<string> {
  const counts = await getLinesOfCode()
  return arrayTableToMarkdown([
    ['file type', 'files', 'lines of code'],
    ...Object.entries(counts).map(([k, v]) => {
      return [k, String(v.files), String(v.lines)]
    }),
  ])
}
