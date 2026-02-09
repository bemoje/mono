/**
 * Finds source code files that are missing corresponding test files.
 * Scans all workspace libraries and apps for TypeScript files without .test.ts counterparts.
 */
import { glob } from 'glob'
import { timer } from '../util/timer.mjs'
import { formatTableForTerminal } from '../util/formatTableForTerminal.mjs'
import upath from 'upath'
import fs from 'fs/promises'

/**
 * Checks if a source file has a corresponding test file.
 * @param {string} sourceFile - Path to the source file
 * @returns {Promise<boolean>} True if test file exists
 */
async function hasTestFile(sourceFile) {
  const parsed = upath.parse(sourceFile)
  const testFile = upath.join(parsed.dir, `${parsed.name}.test${parsed.ext}`)
  try {
    await fs.access(testFile)
    return true
  } catch {
    return false
  }
}

/**
 * Determines if a file should have a test.
 * Excludes index files, type definition files, and other special cases.
 * @param {string} filePath - Path to check
 * @returns {boolean} True if file should have tests
 */
function shouldHaveTest(filePath) {
  const parsed = upath.parse(filePath)
  const fileName = parsed.name

  // Skip index files
  if (fileName === 'index') return false

  // Skip files that start with 'T' and are likely type definitions
  // (convention in this repo, e.g., TCryptoAlgorithm.ts)
  if (fileName.startsWith('T') && fileName.length > 1 && fileName[1] === fileName[1].toUpperCase()) {
    return false
  }

  // Skip type definition files
  if (fileName.endsWith('.d')) return false

  // Skip config files
  if (fileName.endsWith('.config') || fileName.endsWith('config')) return false

  return true
}

/**
 * Finds all source files missing test files in the repository.
 * @returns {Promise<Array<{workspace: string, file: string, relativePath: string}>>}
 */
async function findFilesWithoutTests() {
  const filesWithoutTests = []

  // Find all TypeScript files in libs and apps
  const patterns = ['libs/*/src/**/*.ts', 'apps/*/src/**/*.ts']

  for (const pattern of patterns) {
    const files = await glob(pattern, {
      ignore: ['**/*.test.ts', '**/*.spec.ts', '**/node_modules/**'],
    })

    for (const file of files) {
      if (!shouldHaveTest(file)) continue

      const hasTest = await hasTestFile(file)
      if (!hasTest) {
        const parts = file.split('/')
        const workspace = parts.slice(0, 2).join('/')
        const relativePath = parts.slice(2).join('/')
        filesWithoutTests.push({
          workspace,
          file: upath.basename(file),
          relativePath: file,
        })
      }
    }
  }

  return filesWithoutTests
}

await timer(
  [upath.parse(import.meta.filename).name, 'Finding source files without test files...'],
  async (log) => {
    const filesWithoutTests = await findFilesWithoutTests()

    if (filesWithoutTests.length === 0) {
      log.info('\n✓ All source files have corresponding test files!')
      return
    }

    log.info(`\n✗ Found ${filesWithoutTests.length} source files without test files:\n`)

    // Group by workspace
    const byWorkspace = filesWithoutTests.reduce((acc, item) => {
      if (!acc[item.workspace]) acc[item.workspace] = []
      acc[item.workspace].push(item)
      return acc
    }, {})

    // Print grouped results
    for (const [workspace, files] of Object.entries(byWorkspace)) {
      log.info(`\n${workspace} (${files.length} files):`)
      const tableData = files.map((f) => [f.file, f.relativePath])
      log.info(formatTableForTerminal(tableData, ['File', 'Path']))
    }

    log.info(`\nTotal: ${filesWithoutTests.length} files missing tests`)
  },
)
