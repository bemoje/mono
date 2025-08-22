import fs from 'fs-extra'

/**
 * Writes content to a file only if the file doesn't exist or if the content is different from the existing file.
 */
export async function outputFileIfChanged(filepath, content) {
  if (await fs.pathExists(filepath)) {
    const cur = await fs.readFile(filepath, 'utf8')
    if (cur === content) {
      return
    }
  }
  await fs.outputFile(filepath, content)
  return filepath
}
