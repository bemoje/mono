import type { ICommand } from '../types'

/**
 * Validates option long name are unique across command hierarchy
 */
export function assertOptionLongNotInUse(cmd: ICommand, long: string): void {
  if (cmd.options.some((opt) => opt.long === long)) {
    throw new Error(`Option long name already in use: --${long}`)
  }
}
