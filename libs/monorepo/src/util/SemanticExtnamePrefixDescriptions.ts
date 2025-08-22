import { SemanticExtnamePrefix } from './SemanticExtnamePrefix'

/**
 * A record mapping semantic extname prefixes to their descriptions.
 *
 * - `d`: Declaration files
 * - `test`: Vitest test suite files
 * - `examples`: Files containing working and tested example usage code (included in git, but ignored by most repo tools)
 * - `benchmark`: Benchmark files (included in git, but ignored by most repo tools)
 * - `temp`: Temporary files (ignored by git, build, tests, etc.)
 * - `wip`: Work in progress files (ignored by git, build, tests, etc.)
 */
export const SemanticExtnamePrefixDescriptions: Record<SemanticExtnamePrefix, string> = {
  d: 'declarations',
  test: 'vitest test suite',
  examples: 'contains working and tested example usage code. Included in git, but ignored by most repo tools',
  benchmark: 'benchmark files, included in git, but ignored by most repo tools.',
  temp: 'temporary files, ignored by git, build, tests, etc.',
  wip: 'work in progress, ignored by git, build, tests, etc.',
} as const
