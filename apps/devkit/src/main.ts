import { Command } from '@mono/cli'
import { buildReadmeAction } from './commands/build_readme'
import { clearNodeModulesAction } from './commands/clear_node_modules'
import { configAction } from './commands/config'
import { configDirpathHook } from './commands/config'
import { configFile } from './core/config/config'
import { configFilepathHook } from './commands/config'
import { createLibsWorkspaceAction } from './commands/create_workspace'
import { fixDashCharsAction } from './commands/fix_dash_chars'
import { fixEmptyFilesAction } from './commands/fix_empty_files'
import { fixIndexTsAction } from './commands/fix_index_ts'
import { fixMissingDependencies } from './commands/fix_missing_dependencies'
import { fixVitestImportsAction } from './commands/fix_vitest_imports'
import { fixWorkspaceImportsAction } from './commands/fix_workspace_imports'
import fs from 'fs-extra'
import { linesOfCodeAction } from './commands/lines_of_code'
import { listImportStatementsAction } from './commands/list_import_statements'
import { listImportedBuiltinNodeDependencies } from './commands/listImportedBuiltinNodeDependencies'
import { listImportedDependenciesAction } from './commands/list_imported_dependencies'
import { listImportedFilesAction } from './commands/list_imported_files'
import { listImportsRecursivelyForAction } from './commands/list_imports_recursively_for'
import { listLibModuleExportsAction } from './commands/list_lib_module_exports'
import { listTopImportStatementsAction } from './commands/list_top_import_statements'
import { missingCoverageFilesAction } from './commands/missing_coverage_files'
import { missingTsdocFilesAction } from './commands/missing_tsdoc_files'
import { runInteractive2 } from './runInteractive2'
import upath from 'upath'

const pkg = fs.readJsonSync(
  upath.joinSafe(upath.dirname(process.argv[1]), ...(process.argv[1].endsWith('ts') ? ['..'] : []), 'package.json')
)

const libDirnames = fs.readdirSync('libs')
configFile.load()
const cli = new Command('devkit')
  .setVersion(pkg.version)
  .setDescription(pkg.description)

  // config
  .addCommand('config', (cmd) => {
    return cmd
      .setDescription('Edit the config')

      .addOption('-f, --filepath', { description: 'Print the path the repo config file.' })
      .addOption('-d, --dirpath', { description: 'Print the path the repo config data directory.' })

      .addOptionHook('filepath', configFilepathHook)
      .addOptionHook('dirpath', configDirpathHook)

      .setAction(configAction)
  })

  // dev
  .addCommand('create-libs-workspace', (cmd) => {
    return cmd
      .setDescription('Create a new library in the libs folder.')
      .addArgument('<workspace>', { description: 'The name of the library to create.' })
      .addOption('-y, --yes', { description: 'Skip confirmation.' })
      .addOption('-d, --dryRun', { description: 'Dry run. No changes made.' })
      .addOption('-q, --quiet', { description: 'Omit output from package manager.' })
      .addOption('-s, --silent', { description: 'No output.' })
      .setAction(createLibsWorkspaceAction)
  })

  .addCommand('clear-node-modules', (cmd) => {
    return cmd
      .setDescription('Completely removes and reinstalls all node_modules and lock files.')
      .setAction(clearNodeModulesAction)
  })

  // build
  .addCommand('build-readme', (cmd) => {
    return cmd
      .setGroup('Build Commands')
      .setDescription('Generate the root README.md from template.')
      .setAction(buildReadmeAction)
  })

  // check
  .addCommand('missing-tsdoc-files', (cmd) => {
    return cmd
      .setGroup('Check Commands')
      .setDescription('Validate TSDoc documentation for all library exports.')
      .setAction(missingTsdocFilesAction)
  })

  .addCommand('missing-coverage-files', (cmd) => {
    return cmd
      .setGroup('Check Commands')
      .setDescription('Show files with missing test coverage.')
      .addOption('-c, --check', { description: 'Exit with error code if files with missing coverage are found.' })
      .setAction(missingCoverageFilesAction)
  })

  // fix
  .addCommand('fix-missing-dependencies', (cmd) => {
    return cmd
      .setGroup('Fix Commands')
      .setDescription('Check for missing dependencies in workspaces and suggest commands to add them.')
      .addArgument('[wsPaths...]', { description: 'Workspace dirpaths' })
      .addOption('-y, --yes', { description: 'Skip confirmation.' })
      .addOption('-a, --add-to-staged', { description: 'Add commands to staged changes.' })
      .setAction(fixMissingDependencies)
  })
  .addCommand('fix-workspace-imports', (cmd) => {
    return cmd
      .setGroup('Fix Commands')
      .setDescription('Fix incorrect workspace imports.')

      .addOption('-y, --yes', { description: 'Skip confirmation.' })
      .addOption('-d, --dryRun', { description: 'Dry run. No changes made.' })
      .addOption('-q, --quiet', { description: 'Omit output from package manager.' })
      .addOption('-s, --silent', { description: 'No output.' })
      .addOption('-w, --workspaces [names...]', {
        description: 'Comma-sep list of workspace names to fix. Defaults to all.',
      })
      .addOption('-f, --fixes [names...]', {
        description: 'Fixes to apply.',
        choices: ['imports'],
        defaultValue: ['imports'],
      })
      .setAction(fixWorkspaceImportsAction)
  })

  .addCommand('fix-vitest-imports', (cmd) => {
    return cmd
      .setGroup('Fix Commands')
      .setDescription('Ensure all test files have necessary Vitest imports.')
      .addArgument('[glob]', {
        description: 'File glob pattern',
        defaultValue: '{libs,apps,packages}/*/src/**/*.test.{ts,tsx}',
      })
      .setAction(fixVitestImportsAction)
  })

  .addCommand('fix-index-ts', (cmd) => {
    return cmd
      .setGroup('Fix Commands')
      .setDescription('Generate barrel export index.ts for a workspace.')
      .addArgument('[dirnames...]', { description: 'Workspace dirnames within libs/*', choices: libDirnames })
      .addOption('-i, --ignore <dirnames...>', {
        description: 'Workspace dirnames to ignore (relative to repo root)',
      })
      .addOption('-a, --add-to-staged', { description: 'Add commands to staged changes.' })
      .setAction(fixIndexTsAction)
  })

  .addCommand('fix-empty-files', (cmd) => {
    return cmd
      .setGroup('Fix Commands')
      .setDescription('Remove empty files from all workspaces.')
      .setAction(fixEmptyFilesAction)
  })

  .addCommand('fix-dash-chars', (cmd) => {
    return cmd
      .setGroup('Fix Commands')
      .setDescription('Replace bad dash characters (em-dash) with regular dashes.')
      .setAction(fixDashCharsAction)
  })

  // insights
  .addCommand('list-import-statements', (cmd) => {
    return cmd
      .setGroup('Insight Commands')
      .setDescription('List all import statements found in libs source files.')
      .setAction(listImportStatementsAction)
  })

  .addCommand('list-imported-files', (cmd) => {
    return cmd
      .setGroup('Insight Commands')
      .setDescription('List the most imported files across the repo.')
      .addArgument('[n]', { description: 'Print top n most frequent import statements', defaultValue: '5000' })
      .setAction(listImportedFilesAction)
  })
  .addCommand('list-imports-recursively-for', (cmd) => {
    return cmd
      .setGroup('Insight Commands')
      .setDescription('List imports recursively for specified entry points.')
      .addArgument('[entryPoints...]', { description: 'Entry points to analyze' })
      .setAction(listImportsRecursivelyForAction)
  })

  .addCommand('list-top-import-statements', (cmd) => {
    return cmd
      .setGroup('Insight Commands')
      .setDescription('List the most used import statements across the repo.')
      .addArgument('[n]', { description: 'Print top n most frequent import statements', defaultValue: '5000' })
      .setAction(listTopImportStatementsAction)
  })

  .addCommand('list-imported-dependencies', (cmd) => {
    return cmd
      .setGroup('Insight Commands')
      .setDescription('List all imported internal and external dependencies for each workspace.')
      .setAction(listImportedDependenciesAction)
  })

  .addCommand('list-imported-node-dependencies', (cmd) => {
    return cmd
      .setGroup('Insight Commands')
      .setDescription('List all imported built-in node dependencies for each workspace.')
      .setAction(listImportedBuiltinNodeDependencies)
  })

  .addCommand('count-lines-of-code', (cmd) => {
    return cmd
      .setGroup('Insight Commands')
      .setDescription('Count lines of code in the repo.')
      .setAction(linesOfCodeAction)
  })

  .addCommand('list-lib-module-exports', (cmd) => {
    return cmd
      .setGroup('Insight Commands')
      .setDescription('List all available modules and their exports from the libs directory.')
      .setAction(listLibModuleExportsAction)
  })

  .addCommand('wow', (cmd) => {
    return cmd
      .setDescription('Wow!')
      .addCommand('such-command', (cmd) => {
        return cmd
          .addArgument('<name>', { description: 'Your name' })
          .addArgument('[city]', { description: 'City name', choices: ['Herning', 'Ikast', 'Aarhus'] })
          .addOption('-a, --age <int>', { description: 'The persons age' })
          .addOption('-f, --friends <names...>', { description: 'Names of friends' })
          .setDescription('Such command!')
          .setAction((arg1, arg, opts) => {
            console.log('Wow such command!', { arg1, arg2: arg, opts })
          })
      })
      .addCommand('many-commands', (cmd) => {
        return cmd.setDescription('Many commands!').setAction(() => {
          console.log('Wow many commands!')
        })
      })
  })

async function main() {
  if (process.argv.length === 2) {
    // await runInteractive(cli)
    await runInteractive2(cli)
  }

  await cli
    .parseArgv()
    .execute()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

void main()
