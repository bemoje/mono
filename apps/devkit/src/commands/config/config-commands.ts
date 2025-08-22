import { Command } from 'commander'
import { configFile, dataPath } from '../../core/config/config'
import { execSync } from 'child_process'
import templates from '../../core/templates/templates'

export function configPath() {
  const cmd = new Command('path')
  cmd.version('0.0.1') //
  cmd.description('Print the path the repo config file.')
  cmd.action(() => {
    console.log(dataPath)
  })
  return cmd
}

export function configEdit() {
  const cmd = new Command('edit')
  cmd.version('0.0.1') //
  cmd.description('Edit the config')
  cmd.action(() => {
    execSync(
      templates.commands.openFileInIDE.renderString({
        filepath: configFile.filepath, //
      }),
    )
  })
  return cmd
}
