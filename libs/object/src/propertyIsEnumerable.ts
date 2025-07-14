/**
 * Calls Object.prototype.propertyIsEnumerable on the given object.
 */
export function propertyIsEnumerable(o: object, key: PropertyKey) {
  return Object.prototype.propertyIsEnumerable.call(o, key)
}
