import fs from 'fs'
import os from 'os'
import upath from 'upath'

/**
 * Returns a path to the os tmpdir location.
 */
export const getTempDataPath = function getTempDataPath(...paths: string[]): string {
  const result = fs.realpathSync(os.tmpdir())
  if (!result) throw new Error('Temp data directory not found')
  return upath.join(fs.realpathSync(result), ...paths)
}
