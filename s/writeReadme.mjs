import fs from 'fs-extra'
import { renderReadme } from './util/renderReadme.mjs'

/**
 * Updates the README.md file with automatically generated library exports documentation.
 */
export async function writeReadme() {
  console.log('🔄 Starting ./README.md libraries update...')
  const { readmePath, updatedReadme, sortedLibNames, filesSummaries } = await renderReadme()
  console.log(sortedLibNames.length, `libraries found.`)
  console.log(filesSummaries.length, `documented functions found.`)
  await fs.writeFile(readmePath, updatedReadme, 'utf8')
  console.log('✅ ./README.md update completed successfully!')
}

writeReadme().catch((error) => {
  console.error(error)
  console.error('❌ Error updating README.md:', error)
  process.exit(1)
})
