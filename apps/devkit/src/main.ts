import 'source-map-support/register'
import { enablePrettyStackTrace } from '@mono/stacktrace'
enablePrettyStackTrace()
import { Command } from 'commander'
import { configEdit, configPath } from './commands/config/config-commands'
import { createLib } from './commands/libs/create'
import { fixDeps } from './commands/deps/fix'
import { insertImports } from './commands/imports/insertImports'
import { mostImportedFiles } from './commands/imports/mostImportedFiles'
import { mostFrequentImportStatements } from './commands/imports/mostFrequentImportStatements'
import { cleanCommands } from './commands/clean/clean-commands'
import { insightCommands } from './commands/insight/insight-commands'
import { docsCommands } from './commands/docs/docs-commands'
import { runCommand } from './commands/run/run-command'
import { wsCommand } from './commands/ws/ws-command'
import { buildCommands } from './commands/build/build-commands'
import { publishCommands } from './commands/publish/publish-commands'
import { debugCommands } from './commands/debug/debug-commands'
import version from './core/version'
import description from './core/description'

new Command('devkit')
  .version(version)
  .description(description)

  .addCommand(
    new Command('libs')
      .alias('l') //
      .addCommand(createLib()),
  )

  .addCommand(
    new Command('deps')
      .alias('d') //
      .addCommand(fixDeps()),
  )

  .addCommand(
    new Command('config')
      .alias('c') //
      .addCommand(configPath())
      .addCommand(configEdit()),
  )
  .addCommand(
    new Command('imports')
      .alias('i') //
      .addCommand(insertImports())
      .addCommand(mostImportedFiles())
      .addCommand(mostFrequentImportStatements()),
  )

  .addCommand(cleanCommands())
  .addCommand(insightCommands())
  .addCommand(docsCommands())
  .addCommand(runCommand())
  .addCommand(wsCommand())
  .addCommand(buildCommands())
  .addCommand(publishCommands())
  .addCommand(debugCommands())

  .parseAsync()
  .catch(console.error)
