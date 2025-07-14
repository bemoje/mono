import fs from 'fs-extra'

/**
 * Synchronous version of `updateFileLines`.
 */
export function updateFileLinesSync(
  filepath: string,
  update: (fileContentLines: string[]) => string | string[],
): void {
  fs.ensureFileSync(filepath)
  const content = fs.readFileSync(filepath, 'utf8')
  const lines = content.split(/\r?\n/)
  const retval = update(lines)
  const updated = Array.isArray(retval) ? retval.join('\n') : retval
  fs.outputFileSync(filepath, updated)
}
