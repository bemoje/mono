import { Arrayable } from 'type-fest'
import { SemanticExtnamePrefix } from './SemanticExtnamePrefix'
import SemanticExtnamePrefixes from './SemanticExtnamePrefixes'

/**
 * Checks if a file path has any of the specified semantic extension prefixes (e.g., .test.ts, .spec.js).
 */
export function hasExtnamePrefix(
  tsFilepath: string,
  prefixes: Arrayable<SemanticExtnamePrefix> = SemanticExtnamePrefixes as unknown as SemanticExtnamePrefix[],
) {
  return new RegExp('[.](' + [prefixes].flat(2).join('|') + ')[.][^/\\\\]+$').test(tsFilepath)
}
