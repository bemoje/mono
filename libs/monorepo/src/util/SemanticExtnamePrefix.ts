/**
 * Constants for semantic filename prefixes used to categorize files by their purpose.
 */
export type SemanticExtnamePrefix = (typeof SemanticExtnamePrefix)[keyof typeof SemanticExtnamePrefix]
export const SemanticExtnamePrefix = {
  d: 'd',
  test: 'test',
  examples: 'examples',
  benchmark: 'benchmark',
  temp: 'temp',
  wip: 'wip',
} as const
