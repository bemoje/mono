import fs from 'fs-extra'
import colors from 'ansi-colors'
import { addDefaultsOptions, DefaultOptions } from '../common/addDefaultsOptions'
import { Command, Option } from 'commander'
import { confirmPrompt } from '../../lib/confirmPrompt'
import { MonoRepo } from '@mono/monorepo'
import { timer } from '@mono/node'

//

export function fixDeps() {
  const cmd = new Command('fix')
  cmd.version('0.0.2') //
  cmd.description('Fix missing and unused dependencies.')
  cmd.addOption(
    new Option('-w, --workspaces [names...]', 'Comma-sep list of workspace names to fix. Defaults to all.'), //
  )
  cmd.addOption(
    new Option('-f, --fixes [names...]', 'Fixes to apply.') //
      .choices(['imports'])
      .default(['imports']),
  )
  addDefaultsOptions(cmd)
  cmd.action(action)
  return cmd
}

//

interface FixDepsOptions extends DefaultOptions {
  workspaces?: string[]
  // fixes?: 'imports'[]
  fixes?: 'imports'[]
}

//

async function action(options: FixDepsOptions) {
  await timer('fix imports', async (log) => {
    if (options.debug) {
      log.debug({ options })
    }

    const fixed = { count: 0 }

    for (const ws of new MonoRepo().workspaces) {
      if (!options.fixes || options.fixes.includes('imports')) {
        for (const { filepath, replaceValue, withValue } of ws.incorrectlyImportedRepoWorkspaces) {
          if (!options.silent) {
            log.info(
              `\nIncorrect import in ${colors.magenta(filepath)}. Replace '${colors.red(replaceValue)}' with '${colors.green(withValue)}'`,
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
            await fs.writeFile(filepath, code.replace(RegExp(replaceValue, 'g'), withValue))
            fixed.count++
          } catch (error) {
            log.error(error)
            log.error(`Failed to fix import in ${filepath}`)
          }
        }
      }
    }
  })
}
