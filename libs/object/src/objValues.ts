/**
 * Identical to Object.values, but typed
 */
export function objValues<T extends object>(o: T) {
  return Object.values(o) as T[Extract<keyof T, string>][]
}
