import type { Logger } from '@mono/node'
import { MonoRepo } from '@mono/monorepo'
import colors from 'ansi-colors'
import { confirmPrompt } from '@mono/terminal'
import fs from 'fs-extra'
import upath from 'upath'

export interface FixWorkspaceImportsOptions {
  yes?: boolean
  dryRun?: boolean
  quiet?: boolean
  silent?: boolean
  debug?: boolean
  workspaces?: string | string[]
  fixes?: string[]
}

export async function fixWorkspaceImportsAction(
  options: FixWorkspaceImportsOptions,
  { logger: log }: { logger: Logger }
) {
  if (options.debug) {
    log.debug({ options })
  }

  const fixed = { count: 0 }

  const workspaces = options.workspaces
    ? Array.isArray(options.workspaces)
      ? options.workspaces
      : [options.workspaces]
    : undefined

  for (const ws of new MonoRepo().workspaces) {
    if (workspaces && !workspaces.includes(upath.basename(ws.path))) {
      continue
    }
    if (options.fixes && !options.fixes.includes('imports')) {
      continue
    }
    for (const { filepath, replaceValue, withValue } of ws.incorrectlyImportedRepoWorkspaces) {
      if (!options.silent) {
        log.info(
          `\nIncorrect import in ${colors.magenta(filepath)}. Replace '${colors.red(replaceValue)}' with '${colors.green(withValue)}'`
        )
      }

      if (!options.yes && !(await confirmPrompt('Proceed?'))) {
        continue
      }

      if (options.dryRun) {
        log.info(`dryRun. Action skipped: Fix import in: ${filepath}`)
        continue
      }

      try {
        const code = await fs.readFile(filepath, 'utf8')
        await fs.writeFile(filepath, code.replaceAll(new RegExp(replaceValue, 'g'), withValue))
        fixed.count++
      } catch (error) {
        log.error(error)
        log.error(`Failed to fix import in ${filepath}`)
      }
    }
  }
}
