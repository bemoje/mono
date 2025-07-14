import fs from 'fs-extra'

export async function buildStats(outfile) {
  const code = await fs.readFile(outfile, 'utf8')
  const lines = code.split('\n').length
  const stats = await fs.stat(outfile)
  const sizeKB = Math.floor(stats.size / 1024)
  return { lines, sizeKB }
}
