export interface ConfigValidationStrategy<T> {
  isValid(content: unknown): content is T
  assertValid(content: unknown): asserts content is T
  applyDefaults(content?: Partial<T>): T
}
