/**
 * Returns a given own property value of a given object.
 */
export function getOwnProperty(obj: object, key: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(obj, key) ? obj[key as keyof typeof obj] : undefined
}
