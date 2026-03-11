import { configFile } from '../core/config/config'
import { execSync } from 'child_process'
import { templates } from '../core/templates/templates'
import upath from 'upath'

export function configAction() {
  execSync(
    templates.commands.openFileInIDE.renderString({
      filepath: configFile.filepath, //
    })
  )
}

export function configFilepathHook() {
  console.log('config file:', configFile.filepath)
  process.exitCode = 0
}

export function configDirpathHook() {
  console.log('config dir:', upath.dirname(configFile.filepath))
  process.exitCode = 0
}
