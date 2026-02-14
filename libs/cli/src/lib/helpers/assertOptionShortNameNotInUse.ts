import type { ICommand } from '../types'

/**
 * Validates option short names are unique across command hierarchy
 */
export function assertOptionShortNameNotInUse(cmd: ICommand, short: string): void {
  for (const opt of cmd.options) {
    if (opt.short === short) {
      throw new Error(`Option short name already in use: -${short}`)
    }
  }
}
