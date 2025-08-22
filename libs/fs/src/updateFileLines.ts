import fs from 'fs-extra'

/**
 * Updates a file by applying a transformation function to an array of lines.
 * The transformation can return either a string (the entire new content) or an array of lines.
 * Creates the file and directories if they don't exist.
 */
export async function updateFileLines(
  filepath: string,
  update: (fileContentLines: string[]) => string | string[] | Promise<string | string[]>,
): Promise<void> {
  await fs.ensureFile(filepath)
  const content = await fs.readFile(filepath, 'utf8')
  const lines = content.split(/\r?\n/)
  const retval = await update(lines)
  const updated = Array.isArray(retval) ? retval.join('\n') : retval
  await fs.outputFile(filepath, updated)
}
