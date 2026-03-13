/**
 * Sets the enumerable property of the specified properties of an object to true.
 */
export function setEnumerable<T extends object>(object: T, ...keys: string[]): T {
  for (const key of keys) {
    Object.defineProperty(object, key, { enumerable: true })
  }
  return object
}
