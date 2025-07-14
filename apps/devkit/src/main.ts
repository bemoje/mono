import 'source-map-support/register'
import { enablePrettyStackTrace } from '@mono/stacktrace'
import { Command } from 'commander'
import { configEdit, configPath } from './commands/config/config-commands'
import { createLib } from './commands/libs/create'
import { fixDeps } from './commands/deps/fix'
import { insertImports } from './commands/imports/insertImports'
import { mostImportedFiles } from './commands/imports/mostImportedFiles'
import { mostFrequentImportStatements } from './commands/imports/mostFrequentImportStatements'
import version from './core/version'
import description from './core/description'

enablePrettyStackTrace()

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

  .parseAsync()
  .catch(console.error)
