import fs from 'fs-extra'
import path from 'upath'
import util from 'util'
import { spawn } from 'child_process'
import { isWindows } from './isWindows'

/**
 * Opens a directory in Windows Explorer. Works on Windows only.
 */
export async function winExplorerOpenDirectory(fspath: string) {
  if (!isWindows()) throw new Error('Not Windows OS')
  if (!(await fs.exists(fspath))) throw new Error('Path does not exist')
  const stats = await fs.stat(fspath)
  fspath = stats.isFile() ? path.dirname(fspath) : fspath
  await util.promisify(spawn)('explorer.exe', [fspath], { detached: true })
}
