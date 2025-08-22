import fs from 'fs-extra'

/**
 * Retrieves the age of a file in milliseconds.
 * @param filepath - The path to the file.
 */
export async function getFileAge(filepath: string): Promise<number> {
  const stats = await fs.stat(filepath)
  const time = stats.ctimeMs || stats.birthtimeMs || stats.mtimeMs
  return Date.now() - time
}
