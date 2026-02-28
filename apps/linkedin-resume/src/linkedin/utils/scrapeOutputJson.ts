import type { CliOptions } from '../../types/CliOptions'
import type { Logger } from '@mono/node'
import type { ResumeSection } from '../../types/ResumeSection'
import { SCRAPE_PATH } from '../../constants'
import fs from 'fs-extra'
import upath from 'upath'

/**
 * Output scraped section data to a JSON file in the scrape directory, and log the result.
 * @param data The data to write to the JSON file
 * @param section The resume section being scraped (used for filename and logging)
 */
export async function scrapeOutputJson(
  data: object | object[],
  section: ResumeSection,
  logger: Logger,
  options: CliOptions,
): Promise<void> {
  const filepath = upath.join(SCRAPE_PATH, `${section}-scraped.json`)
  await fs.outputFile(filepath, JSON.stringify(data, null, 2))
  if (Array.isArray(data)) {
    logger.log(`${section}:`, data.length)
  } else {
    logger.log(`${section}:`, 1)
  }
  if (options.debug) {
    logger.debug(filepath)
  }
}
