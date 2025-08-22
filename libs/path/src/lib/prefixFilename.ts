import upath from 'upath'

/**
 * Append string to the beginning of the filename.
 *
 * @example ```ts
 * path.fileNameWithPrefix('path/to/file-name.ext', 'new-')
 * // => path/to/new-file-name.ext
 * ```
 */
export function prefixFilename(filePath: string, prefix: string) {
  const ext = upath.extname(filePath)
  const fileNameWithoutExt = upath.basename(filePath, ext)
  return upath.joinSafe(upath.dirname(filePath), prefix + fileNameWithoutExt + ext)
}
