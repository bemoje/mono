import fs from 'fs'
import path from 'path'
import { getRepoRootDirpath } from '../util/getRepoRootDirpath.mjs'

const repoRoot = getRepoRootDirpath()

const vitestConfigFilepath = path.join(repoRoot, 'vitest.config.js')
if (!fs.existsSync(vitestConfigFilepath)) {
  console.error(`Vitest config file not found at ${vitestConfigFilepath}`)
  process.exit(1)
}

const coverageDirectory = fs
  .readFileSync(vitestConfigFilepath, 'utf-8')
  .split('\n')
  .find((line) => line.includes('reportsDirectory:'))
  ?.match(/reportsDirectory:\s*['"`](.+?)['"`]/)?.[1]
  ?.trim()

if (!coverageDirectory) {
  console.error(`Could not find reportsDirectory in Vitest config at ${vitestConfigFilepath}`)
  process.exit(1)
}

const coverageSummaryJsonFilepath = path.join(coverageDirectory, 'coverage-summary.json')
if (!fs.existsSync(coverageSummaryJsonFilepath)) {
  console.error(`Coverage summary file not found at ${coverageSummaryJsonFilepath}`)
  process.exit(1)
}

const coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryJsonFilepath, 'utf-8'))

Object.entries(coverageSummary)
  //
  // remove total summary entry
  .filter(([filepath]) => {
    return filepath !== 'total'
  })

  // remove files with no lines of code to cover, eg. files with only types
  .filter(([_, metrics]) => {
    return metrics.lines.total > 0
  })

  // keep files with some uncovered lines of code
  .filter(([_, metrics]) => {
    return Object.values(metrics).some((metric) => {
      return metric.pct < 100 && metric.total > 0
    })
  })

  // normalize filepaths and make relative to repo root
  .map(([filepath]) => {
    return filepath.replace(/\\+/g, '/').replace(repoRoot, '')
  })

  // output filepaths
  .forEach((filepath) => {
    console.log(filepath)
  })
