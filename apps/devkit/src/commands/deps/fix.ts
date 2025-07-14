import fs from 'fs-extra'
import colors from 'ansi-colors'
import { addDefaultsOptions, DefaultOptions } from '../common/addDefaultsOptions'
import { Command, Option } from 'commander'
import { confirmPrompt } from '@mono/terminal'
import { MonoRepo } from '@mono/monorepo'
import { Workspace } from '@mono/monorepo'

//

export function fixDeps() {
  const cmd = new Command('fix')
  cmd.version('0.0.1') //
  cmd.description('Fix missing and unused dependencies.')

  cmd.addOption(
    new Option('-w, --workspaces [names...]', 'Comma-sep list of workspace names to fix. Defaults to all.') //
      .choices(new MonoRepo().workspaces.map((ws) => ws.name)),
  )
  cmd.addOption(
    new Option('-f, --fixes [names...]', 'Fixes to apply. Defaults to all.') //
      .choices(['imports']),
  )
  addDefaultsOptions(cmd)

  cmd.action(action)

  return cmd
}

//

interface FixDepsOptions extends DefaultOptions {
  workspaces?: string[]
  fixes?: 'imports'[]
  // fixes?: ('unused' | 'missing' | 'missingDev' | 'imports')[]
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
    if (!options.fixes || options.fixes.includes('imports'))
      await fixIncorrectlyImportedRepoWorkspaces(ws, options, fixed)
    // if (!options.fixes || options.fixes.includes('unused')) await uninstallUnusedDependencies(ws, options, fixed)
    // if (!options.fixes || options.fixes.includes('missing')) await installMissingDependencies(ws, options, fixed)
    // if (!options.fixes || options.fixes.includes('missingDev')) await installMissingDevDependencies(ws, options, fixed)
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

// async function uninstallUnusedDependencies(
//   workspace: Workspace,
//   options: FixDepsOptions,
//   fixed: { count: number },
// ) {
//   for (const dep of workspace.unusedDependencies) {
//     if (!options.silent) {
//       console.info(`\nUnused dependency in ${colors.magenta(workspace.name)}. Uninstall '${colors.red(dep)}'`)
//     }

//     if (!options.yes && !(await confirmPrompt('Proceed?'))) {
//       continue
//     }

//     const command = templates.commands.removeDependency.render({
//       workspace: workspace.name, //
//       dependency: dep,
//     })

//     if (options.dryRun) {
//       console.log('dryRun. Command skipped: ' + command)
//       continue
//     }

//     try {
//       execSync(command, {
//         stdio: options.quiet ? 'ignore' : 'inherit',
//         cwd: path.resolve(workspace.parent.path),
//       })
//       fixed.count++
//     } catch (error) {
//       console.error(error)
//       console.error(`Failed to uninstall ${dep} from ${workspace.name}`)
//     }
//   }
// }

// async function installMissingDependencies(
//   workspace: Workspace,
//   options: FixDepsOptions,
//   fixed: { count: number },
// ) {
//   for (const dep of workspace.missingDependencies) {
//     if (!options.silent) {
//       console.info(`\nMissing dependency in ${colors.magenta(workspace.name)}. Install '${colors.green(dep)}'`)
//     }

//     if (!options.yes && !(await confirmPrompt('Proceed?'))) {
//       continue
//     }

//     let version =
//       workspace.parent.packageJson.dependencies?.[dep] ?? workspace.parent.packageJson.devDependencies?.[dep]

//     version = version && version.includes('.') ? `@${version}` : ''

//     const command = templates.commands.addDependency.render({
//       dependency: dep + version,
//     })

//     if (options.dryRun) {
//       console.log('dryRun. Command skipped: ' + command)
//       continue
//     }

//     try {
//       execSync(command, {
//         stdio: options.quiet ? 'ignore' : 'inherit',
//         cwd: path.resolve(workspace.parent.path),
//       })
//       fixed.count++
//     } catch (error) {
//       console.error(error)
//       console.error(`Failed to install ${dep} in ${workspace.name}`)
//     }
//   }
// }

// async function installMissingDevDependencies(
//   workspace: Workspace,
//   options: FixDepsOptions,
//   fixed: { count: number },
// ) {
//   for (const dep of workspace.missingDevDependencies) {
//     if (!options.silent) {
//       console.info(`\nMissing devDependency in ${colors.magenta(workspace.name)}. Install '${colors.green(dep)}'`)
//     }

//     if (!options.yes && !(await confirmPrompt('Proceed?'))) {
//       continue
//     }

//     const command = templates.commands.addDevDependency.render({
//       dependency: dep,
//     })

//     if (options.dryRun) {
//       console.log('dryRun. Command skipped: ' + command)
//       continue
//     }

//     try {
//       execSync(command, {
//         stdio: options.quiet ? 'ignore' : 'inherit',
//         cwd: path.resolve(workspace.parent.path),
//       })
//       fixed.count++
//     } catch (error) {
//       console.error(error)
//       console.error(`Failed to install ${dep} in ${workspace.name}`)
//     }
//   }
// }
