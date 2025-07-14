/**
 * Checks if the current platform is OSX.
 * It checks the 'process' object and the 'platform' property to determine if the platform is 'darwin'.
 * @returns A boolean indicating whether the current platform is OSX.
 */

export function isOSX(): boolean {
  return process.platform === 'darwin'
}
