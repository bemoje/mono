/**
 * Retrieves the value associated with the specified key from an object.
 */
export function objGet<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
