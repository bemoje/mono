import fs from 'fs-extra'

/**
 * Get the name of the first file (not directory) found in a directory.
 */
export async function getFirstFileInDir(dirpath: string) {
  const dirents = await fs.readdir(dirpath, { withFileTypes: true })
  const fileDirents = dirents.filter((file) => file.isFile())
  const filenames = fileDirents.map((file) => file.name)
  const firstFileName = filenames[0]
  return firstFileName
}
