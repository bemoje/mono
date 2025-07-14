/**
 * Sets the specified properties of an object as non-enumerable.
 */
export function setNonEnumerable<T extends object>(object: T, ...properties: string[]): T {
  for (const prop of properties) {
    Object.defineProperty(object, prop, { enumerable: false })
  }
  return object
}
