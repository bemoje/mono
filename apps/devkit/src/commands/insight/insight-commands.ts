import { Command } from 'commander'
import { inspect } from 'node:util'
import fs from 'fs-extra'
import upath from 'upath'
import { exec } from 'node:child_process'
import { timer } from '../../lib/timer'
import { getLinesOfCode } from '../../lib/getLinesOfCode'
import { formatTableForTerminal } from '../../lib/formatTableForTerminal'
import { getRepoRootDirpath } from '../../lib/getRepoRootDirpath'
import { importLibs, getLibsImportStatements } from '../../lib/importLibs'
import { parseLibsTsDocSummaries } from '../../lib/renderReadme'
import { getAllWorkspacePaths } from '../../lib/workspaces'

export function insightCommands() {
  return new Command('insight')
    .alias('in')
    .description('Repo insight and analysis tools.')
    .addCommand(insightLoc())
    .addCommand(insightTsdoc())
    .addCommand(insightImportStatements())
    .addCommand(insightModules())
    .addCommand(insightDepcheck())
    .addCommand(insightCoverage())
}

function insightLoc() {
  return new Command('loc').description('Count lines of code in the repo.').action(async () => {
    await timer(['loc', 'Counting lines of code in repo...'], async (log) => {
      const counts = await getLinesOfCode()
      log.info(
        '\n' +
          formatTableForTerminal(
            Object.entries(counts).map(([k, v]) => [k, String(v.files), String(v.lines)]),
            ['file type', 'files', 'lines of code'],
          ),
      )
    })
  })
}

function insightTsdoc() {
  return new Command('tsdoc')
    .description('Validate TSDoc documentation for all library exports.')
    .action(async () => {
      await timer(['tsdoc', 'Checking library exports for TSDoc...'], async (log) => {
        const { printLogs } = await parseLibsTsDocSummaries()
        printLogs(log)
      })
    })
}

function insightImportStatements() {
  return new Command('import-statements')
    .description('List all import statements found in libs source files.')
    .action(async () => {
      const arr = await getLibsImportStatements()
      arr.forEach((statement) => {
        console.log(statement)
      })
    })
}

function insightModules() {
  return new Command('modules')
    .description('List all available modules and their exports from the libs directory.')
    .action(async () => {
      console.log('Listing all built modules in libs directory...')
      const libs = Object.fromEntries((await importLibs()).entries())
      console.log(inspect(libs, { colors: false, depth: 1 }).replace(/\[Module: null prototype\] /g, ''))
    })
}

function insightDepcheck() {
  return new Command('depcheck')
    .description('Run depcheck on all workspaces to find unused/missing dependencies.')
    .action(async () => {
      await timer(['depcheck', 'Running depcheck on workspaces...'], async (log) => {
        const wsPaths = await getAllWorkspacePaths()
        const promises = wsPaths.map((wsPath) => {
          return new Promise<void>((resolve) => {
            const res = exec(`yarn depcheck`, { cwd: upath.join(getRepoRootDirpath(), wsPath) })
            res.stdout?.on('data', (data: string) => {
              if (typeof data !== 'string') {
                resolve()
                return
              }
              data.split('\n').forEach((line, i, arr) => {
                if (/(Unused|Missing) (devDependencies|dependencies)/g.test(line)) {
                  log.warn(`${wsPath} : ${line} :: ${arr[i + 1]}`)
                }
              })
            })
            res.stdout?.on('end', () => resolve())
            res.on('close', () => resolve())
            res.on('error', (e) => log.error(e))
            res.stderr?.on('error', (e) => log.error(e))
            res.stdout?.on('error', (e) => log.error(e))
          })
        })
        await Promise.all(promises)
      })
    })
}

function insightCoverage() {
  return new Command('coverage')
    .description('Show files with missing test coverage.')
    .option('--check', 'Exit with error code if files with missing coverage are found.')
    .action(async (opts: { check?: boolean }) => {
      const repoRoot = getRepoRootDirpath()
      const vitestConfigFilepath = upath.join(repoRoot, 'vitest.config.js')
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

      const coverageSummaryJsonFilepath = upath.join(coverageDirectory, 'coverage-summary.json')
      if (!fs.existsSync(coverageSummaryJsonFilepath)) {
        console.error(`Coverage summary file not found at ${coverageSummaryJsonFilepath}`)
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
        console.log(filepath)
      })

      if (opts.check && result.length > 0) {
        console.error(`\nError: ${result.length} files with missing coverage found.`)
        process.exit(1)
      }
    })
}
