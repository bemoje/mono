import { bindArg } from '@mono/fn'
import { Arrayable } from 'type-fest'

/**
 * Checks if a file path has any of the specified file extensions.
 */
export function hasExtname(tsFilepath: string, extnames: Arrayable<string>): boolean {
  return new RegExp('[.](' + [extnames].flat(2).join('|') + ')$').test(tsFilepath)
}

hasExtname.js = bindArg(hasExtname, 1, ['js', 'mjs', 'jsx', 'cjs'])
hasExtname.json = bindArg(hasExtname, 1, ['json', 'jsonc'])
hasExtname.yaml = bindArg(hasExtname, 1, ['yaml', 'yml'])
hasExtname.markdown = bindArg(hasExtname, 1, ['md', 'markdown'])
hasExtname.ts = bindArg(hasExtname, 1, ['ts', 'mts', 'tsx'])
