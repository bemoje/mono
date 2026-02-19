import upath from 'upath'
import fs from 'fs-extra'
import { SCRAPE_PATH } from '../../constants'
import { ResumeSection } from '../../types/ResumeSection'

/**
 * Read scraped section data from a JSON file in the scrape directory.
 * @param section The resume section to read (used for filename)
 * @returns The parsed data from the JSON file
 */
export async function scrapeReadJson<Ret>(section: ResumeSection) {
  const filepath = upath.join(SCRAPE_PATH, `${section}-scraped.json`)
  if (!(await fs.pathExists(filepath))) {
    return [] as unknown as Ret
  }
  return (await fs.readJson(filepath)) as Ret
}
