import type { Logger } from '@mono/node'
import fs from 'fs-extra'
import upath from 'upath'
import { getRepoRootDirpath } from '../lib/getRepoRootDirpath'

export async function missingCoverageFilesAction(opts: { check?: boolean }, { logger: log }: { logger: Logger }) {
  const repoRoot = getRepoRootDirpath()
  const vitestConfigFilepath = upath.join(repoRoot, 'vitest.config.js')
  if (!fs.existsSync(vitestConfigFilepath)) {
    log.error(`Vitest config file not found at ${vitestConfigFilepath}`)
    process.exit(1)
  }

  const coverageDirectory = fs
    .readFileSync(vitestConfigFilepath, 'utf-8')
    .split('\n')
    .find((line) => line.includes('reportsDirectory:'))
    ?.match(/reportsDirectory:\s*['"`](.+?)['"`]/)?.[1]
    ?.trim()

  if (!coverageDirectory) {
    log.error(`Could not find reportsDirectory in Vitest config at ${vitestConfigFilepath}`)
    process.exit(1)
  }

  const coverageSummaryJsonFilepath = upath.join(coverageDirectory, 'coverage-summary.json')
  if (!fs.existsSync(coverageSummaryJsonFilepath)) {
    log.error(`Coverage summary file not found at ${coverageSummaryJsonFilepath}`)
    process.exit(1)
  }

  type CoverageMetric = { pct: number; total: number; covered: number; skipped: number }
  type CoverageEntry = {
    lines: CoverageMetric
    statements: CoverageMetric
    functions: CoverageMetric
    branches: CoverageMetric
  }

  const coverageSummary: Record<string, CoverageEntry> = JSON.parse(
    fs.readFileSync(coverageSummaryJsonFilepath, 'utf-8'),
  )

  const result = Object.entries(coverageSummary)
    .filter(([filepath]) => filepath !== 'total')
    .filter(([_, metrics]) => metrics.lines.total > 0)
    .filter(([_, metrics]) => {
      return Object.values(metrics).some((metric) => {
        return metric.pct < 100 && metric.total > 0
      })
    })
    .map(([filepath]) => {
      return filepath.replace(/\\+/g, '/').replace(repoRoot, '')
    })

  result.forEach((filepath) => {
    log.log(filepath)
  })

  if (opts.check && result.length > 0) {
    log.error(`\nError: ${result.length} files with missing coverage found.`)
    process.exit(1)
  }
}
