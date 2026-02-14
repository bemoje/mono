import type { ICommand } from '../types'

/**
 * Validates option names are unique across command hierarchy
 */
export function assertOptionNameNotInUse(cmd: ICommand, name: string): void {
  if (cmd.options.some((opt) => opt.name === name)) {
    throw new Error(`Option name already in use: --${name}`)
  }
}
