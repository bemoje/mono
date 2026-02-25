import { Arrayable } from 'type-fest'
import upath from 'upath'

/**
 * Checks if a file path has any of the specified basenames.
 */
export function hasBasename(tsFilepath: string, basenames: Arrayable<string>): boolean {
  return [basenames].flat(2).includes(upath.basename(tsFilepath))
}
