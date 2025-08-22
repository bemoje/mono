/**
 * Object.prototype.hasOwnProperty.call
 */
export function hasOwnProperty<T extends object>(object: T, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(object, key)
}
