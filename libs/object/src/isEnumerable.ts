/**
 * Check if the property is enumerable.
 */
export function isEnumerable<T extends object>(target: T, key: PropertyKey) {
  return Object.prototype.propertyIsEnumerable.call(target, key)
}
