import { Logger } from '@mono/node'
import { toCwdRelative } from '@mono/path'
import fs from 'fs-extra'

/**
 * Writes content to a file only if the file doesn't exist or if the content has changed.
 */
export async function outputFileIfChanged(
  filepath: string,
  content: string,
  logger: Logger,
): Promise<string | undefined> {
  if (await fs.pathExists(filepath)) {
    const cur = await fs.readFile(filepath, 'utf8')
    if (cur === content) {
      return
    }
  }
  await fs.outputFile(filepath, content)
  logger.log(toCwdRelative(filepath))
  return filepath
}
