/**
 * Sets a value for a key in an object and returns the value.
 */
export function objSet<T, K extends keyof T>(obj: T, key: K, value: T[K]): T[K] {
  return (obj[key] = value)
}
