/**
 * Identical to Object.getOwnPropertyNames, but typed
 */
export function objOwnKeySymbols<T>(o: T) {
  return Object.getOwnPropertySymbols(o) as Extract<keyof T, symbol>[]
}
