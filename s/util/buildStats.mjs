/**
 * Calculates build statistics for a compiled output file.
 * Returns information about file size and line count for build reporting.
 */
import fs from 'fs-extra'

/**
 * Gets build statistics for an output file.
 * @param {string} outfile - Path to the compiled output file
 * @returns {Promise<{lines: number, sizeKB: number}>} Build statistics
 */
export async function buildStats(outfile) {
  const code = await fs.readFile(outfile, 'utf8')
  const lines = code.split('\n').length
  const stats = await fs.stat(outfile)
  const sizeKB = Math.floor(stats.size / 1024)
  return { lines, sizeKB }
}
