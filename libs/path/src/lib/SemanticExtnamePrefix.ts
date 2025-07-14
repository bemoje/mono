/**
 * Constants for semantic filename prefixes used to categorize files by their purpose.
 */
export type SemanticExtnamePrefix = (typeof SemanticExtnamePrefix)[keyof typeof SemanticExtnamePrefix]
export const SemanticExtnamePrefix = {
  d: 'd',
  test: 'test',
  spec: 'spec',
  examples: 'examples',
  benchmark: 'benchmark',
  temp: 'temp',
  old: 'old',
  wip: 'wip',
} as const
