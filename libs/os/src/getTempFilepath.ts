import { getTempDataPath } from './getTempDataPath'

/**
 * Returns a path to a temporary file with the given basename and subpath.
 */
export function getTempFilepath(basename: string, subpath: string = 'tmp') {
  return getTempDataPath(subpath, Date.now().toString(), basename)
}
