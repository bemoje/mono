import fs from 'fs-extra'

/**
 * Reads coverage summary JSON and generates a compact markdown table.
 */
export async function createCoverageSummary() {
  console.log('🔄 Generating coverage summary markdown...')

  const coverageJsonPath = '.coverage/html/coverage-summary.json'

  // Read the coverage summary JSON
  const coverageData = await fs.readJson(coverageJsonPath)
  const { total } = coverageData

  // Create markdown table
  return [
    '### Coverage',
    ``,
    `| Metric | Total | Covered | Percentage |`,
    `|--------|-------|---------|------------|`,
    `| Lines | ${total?.lines.total} | ${total?.lines.covered} | ${total?.lines.pct}% |`,
    `| Statements | ${total?.statements.total} | ${total?.statements.covered} | ${total?.statements.pct}% |`,
    `| Functions | ${total?.functions.total} | ${total?.functions.covered} | ${total?.functions.pct}% |`,
    `| Branches | ${total?.branches.total} | ${total?.branches.covered} | ${total?.branches.pct}% |`,
    '',
  ].join('\n')
}
