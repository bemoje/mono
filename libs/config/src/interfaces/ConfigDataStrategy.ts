export interface ConfigDataStrategy<T> {
  load(): T | undefined
  save(content: T): void
}
