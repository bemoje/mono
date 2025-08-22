import fs from 'fs-extra'
import upath from 'upath'

/**
 * Returns the home directory of the current user.
 */
export function getHomeDirectory(...paths: string[]): string {
  const result = process.env['HOME'] || process.env['USERPROFILE']
  if (!result) throw new Error('Home directory not found')
  return upath.join(fs.realpathSync(result), ...paths)
}
