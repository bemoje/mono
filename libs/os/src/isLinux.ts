/**
 * Checks if the current platform is Linux.
 * It checks the 'process' object and the 'platform' property to determine if the platform is 'linux'.
 * @returns A boolean indicating whether the current platform is Linux.
 */

export function isLinux(): boolean {
  return process.platform === 'linux'
}
