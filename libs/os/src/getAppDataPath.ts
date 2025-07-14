import fs from 'fs'
import os from 'os'
import upath from 'path'
import { getOS } from './getOS'

/**
 * Get the app data path, depending on the current OS (win, osx, linux).
 */
export function getAppDataPath(...paths: string[]) {
  let result = process.env['APPDATA']
  if (!result) {
    const OS = getOS()
    if (OS === 'windows') {
      result = upath.join(os.homedir(), 'AppData', 'Roaming')
    } else if (OS === 'osx') {
      result = upath.join(os.homedir(), 'Library', 'Application Support')
    } else if (OS === 'linux') {
      result = upath.join(os.homedir(), '.config')
    } else {
      throw new Error('Could not find an appropriate app data path')
    }
  }
  result = fs.realpathSync(result)
  if (!paths.length) return result
  if (paths[0] === os.homedir()) paths[0] = '.' + paths[0]
  return upath.join(result, ...paths)
}
