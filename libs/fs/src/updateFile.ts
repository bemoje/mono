import fs from 'fs-extra'

/**
 * Updates a file by reading its content, applying a transformation function, and writing back the result.
 * Creates the file and directories if they don't exist.
 */
export async function updateFile(
  filepath: string,
  update: (fileContent: string) => string | Promise<string>,
): Promise<void> {
  await fs.ensureFile(filepath)
  const content = await fs.readFile(filepath, 'utf8')
  const updated = await update(content)
  await fs.outputFile(filepath, updated)
}
