import fs from 'fs-extra'
import cp from 'node:child_process'
import { glob } from 'glob'
import upath from 'upath'
import colors from 'ansi-colors'
import onetime from 'onetime'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'
import { getRepoPackageJson } from './getRepoPackageJson.mjs'
import { importLibs } from './importLibs.mjs'
import { getNamedExportTsDocSummary } from './getNamedExportTsDocSummary.mjs'
import { arrayTableToMarkdown } from './arrayTableToMarkdown.mjs'
import { getLinesOfCode } from './getLinesOfCode.mjs'

export const README_TEMPLATE_PATH = 'docs/readmeTemplate.md'

/**
 * Updates the README.md file with automatically generated library exports documentation.
 */
export async function renderReadme() {
  cp.execSync('yarn prettier -w --l ' + README_TEMPLATE_PATH, { stdio: 'inherit' })

  let md = await fs.readFile(README_TEMPLATE_PATH, 'utf8') //

  md = md.replace('<!-- REPO_NAME -->', await getRepoName())
  md = md.replace('<!-- REPO_DESCRIPTION -->', await getRepoDescription())
  md = md.replace('<!-- LINES_OF_CODE_TABLE -->', await renderLinesOfCodeTable())
  md = md.replace('<!-- LIBS_COVERAGE_SUMMARY_TABLE -->', await renderCoverageSummary())
  md = md.replace('<!-- LIBRARY_EXPORTED_MODULES -->', await renderLibsExportedModules())
  md = md.replace('<!-- TOC_TABLE -->', await renderTOC(md))

  const descriptions = await getNpmPkgDescriptions([
    ['<!-- LODASH_INFO -->', 'lodash'],
    ['<!-- ITER_TOOLS_INFO -->', 'iter-tools'],
    ['<!-- TYPE_FEST_INFO -->', 'type-fest'],
    ['<!-- UPATH_INFO -->', 'upath'],
    ['<!-- FS_EXTRA_INFO -->', 'fs-extra'],
    ['<!-- ANSI_COLORS_INFO -->', 'ansi-colors'],
  ])
  descriptions.forEach(({ placeholder, description }) => {
    md = md.replace(placeholder, description)
  })

  return md
}

/**
 * Creates a table of contents from markdown content.
 * @param {string} readmeMarkdown - The markdown content to generate TOC from
 * @returns {Promise<string>} The generated table of contents
 */
export async function renderTOC(readmeMarkdown) {
  return readmeMarkdown
    .replace(/\n```\w+\n[^`]+\n```\n/gs, '\n') // Remove code blocks
    .split('\n')
    .filter((line) => /^#+ /.test(line))
    .map((line) => {
      const level = line.match(/^#+/)[0].length
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

/**
 * Render a markdown document of all exported modules from libraries.
 *
 * 1. Imports all libraries using the importLibs function
 * 2. Scans all TypeScript files in the libs directories
 * 3. Identifies exported modules and their documentation
 * 4. Groups the exports by library
 * 5. Generates a markdown string with all libraries and their exports, including documentation summaries when available
 */
export async function renderLibsExportedModules() {
  const { validSummaries } = await parseLibsTsDocSummaries()

  const libsModulesMap = await importLibs()

  // Group summaries by library
  const librarySummaries = new Map()

  for (const { filepath, summary } of validSummaries) {
    try {
      const regex = /^libs\/([^/]+)\/src\/(.+)\.ts$/
      const [libName, fileName] = filepath.match(regex).slice(1)
      if (libName === 'module.exports') {
        continue
      }
      if (!librarySummaries.has(libName)) {
        librarySummaries.set(libName, [])
      }
      librarySummaries.get(libName).push({
        fileName,
        functionName: upath.basename(fileName),
        summary: summary || 'No description available',
      })
    } catch (error) {
      continue
    }
  }

  // Sort libraries alphabetically
  const sortedLibNames = Array.from(librarySummaries.keys()).sort()

  // Generate markdown for library exports
  const libExports = []

  for (const libName of sortedLibNames) {
    const libModule = libsModulesMap.get(libName)

    // Get all named exports from the library
    const namedExports = Object.keys(libModule)
      .filter((name) => name !== 'default')
      .sort()

    if (namedExports.length === 0) continue

    libExports.push(`**${libName}**`)

    // Add exports with their summaries
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

/**
 * Gets the description of an npm package using the npm CLI.
 * @param {string} name - The npm package name
 * @returns {Promise<string>} The package description
 */
export async function getNpmPkgDescription(name) {
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

/**
 * Retrieves the repository description.
 * @returns {Promise<string>} The repository description
 */
export async function getRepoDescription() {
  return (await getRepoPackageJson()).description
}

/**
 * Retrieves the repository name.
 * @returns {Promise<string>} The repository name
 */
export async function getRepoName() {
  return (await getRepoPackageJson()).name
}

/**
 * Parses and validates TSDoc summaries for all library exports.
 * @returns {Promise<object>} Object containing summaries and validation results
 */
export const parseLibsTsDocSummaries = onetime(async function parseLibsTsDocSummaries() {
  const logActions = []
  const printLogs = (log = console) => {
    logActions.forEach((f) => f(log))
    logActions.length = 0
  }
  const warn = (...args) => logActions.push((log) => log.warn(...args))
  const info = (...args) => logActions.push((log) => log.info(...args))

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
    return
  }

  const tsFilesAndContent = await Promise.all(
    tsFiles.map(async (filepath) => {
      const filename = upath.trimExt(upath.basename(filepath))
      const code = await fs.readFile(filepath, 'utf8')
      return { filepath, filename, code }
    }),
  )

  const summaries = new Map()

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
})

/**
 * Reads coverage summary JSON and generates a compact markdown table.
 */
export async function renderCoverageSummary() {
  const coverageJsonPath = '.coverage/html/coverage-summary.json'

  // Read the coverage summary JSON
  const coverageData = await fs.readJson(coverageJsonPath)
  const { total } = coverageData

  // Create markdown table
  return arrayTableToMarkdown([
    ['Metric', 'Total', 'Covered', 'Percentage'],
    ['Lines', total.lines.total, total.lines.covered, `${total.lines.pct}%`].map(String),
    ['Functions', total.functions.total, total.functions.covered, `${total.functions.pct}%`].map(String),
    ['Branches', total.branches.total, total.branches.covered, `${total.branches.pct}%`].map(String),
  ])
}

export async function getNpmPkgDescriptions(placeholders) {
  return await Promise.all(
    placeholders.map(async ([placeholder, name]) => ({
      placeholder,
      name,
      description: await getNpmPkgDescription(name),
    })),
  )
}

/**
 * Renders a markdown table displaying lines of code counts by file type.
 */
export async function renderLinesOfCodeTable() {
  const counts = await getLinesOfCode()
  return arrayTableToMarkdown([
    ['file type', 'files', 'lines of code'],
    ...Object.entries(counts).map(([k, v]) => [k, String(v.files), String(v.lines)]),
  ])
}
