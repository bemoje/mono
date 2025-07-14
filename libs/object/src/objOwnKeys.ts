/**
 * Identical to Reflect.ownKeys, but typed
 */
export function objOwnKeys<T extends object>(o: T) {
  return Reflect.ownKeys(o) as Extract<keyof T, number | symbol>[]
}
