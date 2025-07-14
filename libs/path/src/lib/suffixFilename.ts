import upath from 'upath'

/**
 * Append string to the end of the filename.
 *
 * @example ```ts
 * path.suffixFilename('path/to/file-name.ext', '-old')
 * // => path/to/file-name-old.ext
 * ```
 */
export function suffixFilename(filePath: string, suffix: string) {
  const split = upath.basename(filePath).split('.')
  split[0] += suffix
  return upath.joinSafe(upath.dirname(filePath), split.join('.'))
}
