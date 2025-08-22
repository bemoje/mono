import { isLinux } from './isLinux'
import { isOSX } from './isOSX'
import { isWindows } from './isWindows'

/**
 * Determines the current operating system.
 * It uses the isWindows, isOSX, and isLinux functions to determine the current operating system.
 * @returns A string indicating the current operating system. It can be 'windows', 'osx', 'linux', or 'unknown'.
 */
export function getOS(): 'windows' | 'osx' | 'linux' | 'unknown' {
  if (isLinux()) return 'linux'
  if (isOSX()) return 'osx'
  if (isWindows()) return 'windows'
  return 'unknown'
}
