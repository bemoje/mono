import fs from 'fs-extra'
import colors from 'ansi-colors'
import { addDefaultsOptions, DefaultOptions } from '../common/addDefaultsOptions'
import { Command, Option } from 'commander'
import { confirmPrompt } from '../../lib/confirmPrompt'
import { MonoRepo } from '@mono/monorepo'
import { Workspace } from '@mono/monorepo'

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
  const t0 = Date.now()

  if (options.debug) {
    console.debug({ options })
  }

  const fixed = { count: 0 }

  for (const ws of new MonoRepo().workspaces) {
    if (options.workspaces && !options.workspaces.includes(ws.name)) continue
    if (!options.fixes || options.fixes.includes('imports')) {
      await fixIncorrectlyImportedRepoWorkspaces(ws, options, fixed)
    }
  }

  if (!options.silent) {
    console.info(colors.green(`Fixed ${fixed.count} dependencies in ${Date.now() - t0} ms.`))
  }
}

async function fixIncorrectlyImportedRepoWorkspaces(
  workspace: Workspace,
  options: FixDepsOptions,
  fixed: { count: number },
) {
  for (const { filepath, replaceValue, withValue } of workspace.incorrectlyImportedRepoWorkspaces) {
    if (!options.silent) {
      console.info(
        `\nIncorrect import in ${colors.magenta(filepath)}. Replace '${colors.red(replaceValue)}' with '${colors.green(withValue)}'`,
      )
    }

    if (!options.yes && !(await confirmPrompt('Proceed?'))) {
      continue
    }

    if (options.dryRun) {
      console.log(`dryRun. Action skipped: Fix import in: ${filepath}`)
      continue
    }

    try {
      const code = await fs.readFile(filepath, 'utf8')
      await fs.writeFile(filepath, code.replace(RegExp(replaceValue, 'g'), withValue))
      fixed.count++
    } catch (error) {
      console.error(error)
      console.error(`Failed to fix import in ${filepath}`)
    }
  }
}
