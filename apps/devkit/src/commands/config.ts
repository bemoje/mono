import { configFile } from '../core/config/config'
import { execSync } from 'node:child_process'
import { templates } from '../core/templates/templates'
import upath from 'upath'
import { Command } from '@mono/cli'

export function configAction() {
  execSync(
    templates.commands.openFileInIDE.renderString({
      filepath: configFile.filepath, //
    }),
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function configFilepathHook({ cmd }: { cmd: Command<any, any> }) {
  console.log('config file:', configFile.filepath)
  cmd.exit(0)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function configDirpathHook({ cmd }: { cmd: Command<any, any> }) {
  console.log('config dir:', upath.dirname(configFile.filepath))
  cmd.exit(0)
}
