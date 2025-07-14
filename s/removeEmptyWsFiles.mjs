import { getEmptyWsFiles } from './util/getEmptyWsFiles.mjs'
import fs from 'fs-extra'

const empty = await getEmptyWsFiles()

for (const file of empty) {
  console.log(`Removing empty file: ${file}`)
  await fs.remove(file)
}
