import fs from 'fs-extra'
import { getFileAge } from './getFileAge'

/**
 * Delete files older than a given timestamp
 * @param dp The dirpath to a folder in which to delete files from
 * @param ageThreshold The age in milliseconds to compare against
 */
export async function deleteOlderThan(dp: string, ageThreshold: number) {
  const files = await fs.readdir(dp)
  for (const file of files) {
    const actualAge = await getFileAge(`${dp}/${file}`)
    if (actualAge > ageThreshold) {
      await fs.remove(`${dp}/${file}`)
    }
  }
}
