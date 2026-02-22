import 'source-map-support/register'
import { enablePrettyStackTrace } from '@mono/stacktrace'
enablePrettyStackTrace()
import 'dotenv/config'
//
import { Command } from 'commander'
//
import version from './core/version'
import description from './core/description'
//
import { config } from './commands/config'
import { build_libs } from './commands/build_libs'
import { fix_workspace_imports } from './commands/fix_workspace_imports'
import { insert_import_statements } from './commands/insert_import_statements'
import { list_top_import_statements } from './commands/list_top_import_statements'
import { list_imported_files } from './commands/list_imported_files'
import { list_import_statements } from './commands/list_import_statements'
import { fix_dash_chars } from './commands/fix_dash_chars'
import { missing_coverage_files } from './commands/missing_coverage_files'
import { list_lib_module_exports } from './commands/list_lib_module_exports'
import { lines_of_code } from './commands/lines_of_code'
import { build_readme } from './commands/build_readme'
import { clear_node_modules } from './commands/clear_node_modules'
import { fix_vitest_imports } from './commands/fix_vitest_imports'
import { fix_index_ts } from './commands/fix_index_ts'
import { run } from './commands/run'
import { exec } from './commands/exec'
import { create_libs_workspace } from './commands/create_workspace'
import { missing_tsdoc_files } from './commands/missing_tsdoc_files'
import { fix_empty_files } from './commands/fix_empty_files'
//

void new Command('devkit')
  .version(version)
  .description(description)

  // config
  .addCommand(config())

  // dev
  .addCommand(run())
  .addCommand(exec())
  .addCommand(create_libs_workspace())
  .addCommand(insert_import_statements())
  .addCommand(clear_node_modules())

  // build
  .addCommand(build_readme())
  .addCommand(build_libs())

  // check
  .addCommand(missing_tsdoc_files())
  .addCommand(missing_coverage_files())

  // fix
  .addCommand(fix_workspace_imports())
  .addCommand(fix_vitest_imports())
  .addCommand(fix_index_ts())
  .addCommand(fix_empty_files())
  .addCommand(fix_dash_chars())

  // insights
  .addCommand(list_import_statements())
  .addCommand(list_imported_files())
  .addCommand(list_top_import_statements())
  .addCommand(lines_of_code())
  .addCommand(list_lib_module_exports())

  // start CLI
  .parseAsync()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
