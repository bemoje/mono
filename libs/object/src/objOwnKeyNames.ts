/**
 * Identical to Object.getOwnPropertyNames, but typed
 */
export function objOwnKeyNames<T>(o: T) {
  return Object.getOwnPropertyNames(o) as Extract<keyof T, string>[]
}
