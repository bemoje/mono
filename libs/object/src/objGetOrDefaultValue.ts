/**
 * This function attempts to retrieve a value from an object using a provided key.
 * If the key does not exist in the object, it sets the provided default value in the object and returns it.
 */
export function objGetOrDefaultValue<T, K extends keyof T>(obj: T, key: K, defaultValue: T[K]): T[K] {
  return obj[key] ?? (obj[key] = defaultValue)
}
