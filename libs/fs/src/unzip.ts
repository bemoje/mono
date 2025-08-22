import extract from 'extract-zip'

/**
 * Extract contents of a zip file at a given filerpath into a given directory
 */
export async function unzip(filepath: string, outdir: string) {
  await extract(filepath, { dir: outdir })
}
