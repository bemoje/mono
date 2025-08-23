import { sync as commandExistsSync } from 'command-exists'

/**
 * Returns whether Visual Studio Code is installed on the system.
 * @example isVsCodeInstalled() //=> true
 */
export function isVsCodeInstalled(): boolean {
  return !!commandExistsSync('code')
}
