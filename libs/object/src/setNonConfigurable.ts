/**
 * Sets the specified properties of an object as non-configurable.
 */
export function setNonConfigurable<T extends object>(object: T, ...properties: string[]): T {
  for (const prop of properties) {
    Object.defineProperty(object, prop, { configurable: false })
  }
  return object
}
