import fs from 'fs-extra'
import colors from 'ansi-colors'
import { addDefaultsOptions, DefaultOptions } from '../lib/addDefaultsOptions'
import { Command, Option } from 'commander'
import { confirmPrompt } from '../lib/confirmPrompt'
import { MonoRepo } from '@mono/monorepo'
import upath from 'upath'
import { timer } from '@mono/node'

export function fix_workspace_imports() {
  return addDefaultsOptions(
    new Command('fix-workspace-imports').alias('fwi').description('Fix incorrect workspace imports.'),
  )
    .addOption(
      new Option('-w, --workspaces [names...]', 'Comma-sep list of workspace names to fix. Defaults to all.'), //
    )
    .addOption(
      new Option('-f, --fixes [names...]', 'Fixes to apply.') //
        .choices(['imports'])
        .default(['imports']),
    )

    .action(async (options: FixDepsOptions) => {
      await timer('fix-workspace-imports', async (log) => {
        if (options.debug) {
          log.debug({ options })
        }

        const fixed = { count: 0 }

        for (const ws of new MonoRepo().workspaces) {
          if (options.workspaces && !options.workspaces.includes(upath.basename(ws.path))) {
            continue
          }
          if (options.fixes && !options.fixes.includes('imports')) {
            continue
          }
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
      })
    })
}

//

interface FixDepsOptions extends DefaultOptions {
  workspaces?: string[]
  // fixes?: 'imports'[]
  fixes?: 'imports'[]
}

//
