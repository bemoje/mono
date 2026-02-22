import { Command } from 'commander'
import { configFile } from '../core/config/config'
import { execSync } from 'node:child_process'
import { templates } from '../core/templates/templates'
import upath from 'upath'

export function config() {
  configFile.load()
  return new Command('config')
    .alias('c')
    .description('Edit the config')

    .option('-f, --filepath', 'Print the path the repo config file.')
    .option('-d, --dirpath', 'Print the path the repo config data directory.')

    .action((opts: { filepath?: boolean; dirpath?: boolean }) => {
      if (opts.filepath) {
        return console.log('config file:', configFile.filepath)
      }

      if (opts.dirpath) {
        return console.log('config dir:', upath.dirname(configFile.filepath))
      }

      execSync(
        templates.commands.openFileInIDE.renderString({
          filepath: configFile.filepath, //
        }),
      )
    })
}
