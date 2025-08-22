import fs from 'fs-extra'
import readline from 'readline'

/**
 * Reads the first line of a file asynchronously.
 */
export async function readFileFirstLine(filepath: string) {
  const fileStream = fs.createReadStream(filepath, 'utf8')
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })
  for await (const line of rl) {
    return line.trim()
  }
  return ''
}
