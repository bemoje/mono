/**
 * Sets the specified properties of an object to be non-writable.
 */
export function setNonWritable<T extends object>(object: T, ...properties: string[]): T {
  for (const prop of properties) {
    Object.defineProperty(object, prop, { writable: false })
  }
  return object
}
