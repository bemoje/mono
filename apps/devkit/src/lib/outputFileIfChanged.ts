import type { Logger } from '@mono/node'
import fs from 'fs-extra'
import { toCwdRelative } from '@mono/path'

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
