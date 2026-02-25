import fs from 'fs-extra'
import { isWindows } from './isWindows'
import { spawn } from 'node:child_process'
import upath from 'upath'
import util from 'node:util'

/**
 * Opens a directory in Windows Explorer. Works on Windows only.
 */
export async function winExplorerOpenDirectory(fspath: string) {
  if (!isWindows()) {
    throw new Error('Not Windows OS')
  }
  if (!(await fs.exists(fspath))) {
    throw new Error('Path does not exist')
  }
  const stats = await fs.stat(fspath)
  fspath = stats.isFile() ? upath.dirname(fspath) : fspath
  await util.promisify(spawn)('explorer.exe', [fspath], { detached: true })
}
