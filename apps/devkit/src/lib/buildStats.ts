import fs from 'fs-extra'

/**
 * Gets build statistics for an output file.
 */
export async function buildStats(outfile: string) {
  const code = await fs.readFile(outfile, 'utf8')
  const lines = code.split('\n').length
  const stats = await fs.stat(outfile)
  const sizeKB = Math.floor(stats.size / 1024)
  return { lines, sizeKB }
}
