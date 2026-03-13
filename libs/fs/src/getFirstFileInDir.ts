import fs from 'fs-extra'

/**
 * Get the name of the first file (not directory) found in a directory.
 */
export async function getFirstFileInDir(dirpath: string) {
  const dirents = await fs.readdir(dirpath, { withFileTypes: true })
  const fileDirents = dirents.filter((file) => {
    return file.isFile()
  })
  const filenames = fileDirents.map((file) => {
    return file.name
  })
  const firstFileName = filenames[0]
  return firstFileName
}
