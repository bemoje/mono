import { parseTsDocs } from './parseTsDocs.mjs'
import { importLibs } from './importLibs.mjs'
import fs from 'fs-extra'
import upath from 'upath'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'
import { createCoverageSummary } from './coverageSummary.mjs'

/**
 * Updates the README.md file with automatically generated library exports documentation.
 */
export async function renderReadme() {
  const pkg = await fs.readJson(upath.join(getRepoRootDirpath(), 'package.json'))

  const { filesSummaries } = await parseTsDocs()
  // console.debug(`📊 Found ${filesSummaries.length} documented functions`)

  const libs = await importLibs()
  // console.debug(`📚 Found ${libs.size} libraries`)

  // Group summaries by library
  const librarySummaries = new Map()

  for (const { filepath, summary } of filesSummaries) {
    const match = filepath.match(/^libs\/([^/]+)\/src\/(.+)\.ts$/)
    if (!match) continue

    const [, libName, fileName] = match
    if (!librarySummaries.has(libName)) {
      librarySummaries.set(libName, [])
    }

    librarySummaries.get(libName).push({
      fileName,
      functionName: upath.basename(fileName),
      summary: summary || 'No description available',
    })
  }

  // Sort libraries alphabetically
  const sortedLibNames = Array.from(librarySummaries.keys()).sort()

  // Generate markdown for library exports
  let markdownSections = []

  for (const libName of sortedLibNames) {
    const libModule = libs.get(libName)
    if (!libModule) continue

    // Get all named exports from the library
    const namedExports = Object.keys(libModule)
      .filter((name) => name !== 'default')
      .sort()

    if (namedExports.length === 0) continue

    markdownSections.push(`### ${libName}`)
    markdownSections.push('')

    // Add exports with their summaries
    const summaries = librarySummaries.get(libName) || []
    const summaryMap = new Map(summaries.map((s) => [s.functionName, s.summary]))

    for (const exportName of namedExports) {
      const summary = summaryMap.get(exportName) || '?'
      markdownSections.push(`- \`${exportName}\` - ${summary}`)
    }

    markdownSections.push('')
  }

  // Read current README.md
  const readmePath = upath.join(getRepoRootDirpath(), 'README.md')

  const updatedReadme = [
    '# ' + pkg.name,
    '',
    pkg.description,
    '',
    '## Libraries',
    '',
    await createCoverageSummary(),
    ...markdownSections,
  ].join('\n')

  return {
    readmePath,
    updatedReadme,
    sortedLibNames,
    filesSummaries,
  }
}
