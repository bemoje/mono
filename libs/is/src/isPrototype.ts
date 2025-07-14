/**
 * Checks if the given value is a prototype object
 * @remarks Function.prototype is considered a prototype object even though (typeof Function.prototype) === 'function'
 * @returns A boolean indicating whether the value is a prototype object.
 */
export function isPrototype<T>(value: T): boolean {
  if (value === Function.prototype) return true
  if (value == null) return false
  if (typeof value !== 'object') return false
  if (!('constructor' in value)) return false
  if (value.constructor?.prototype !== value) return false
  return true
}
