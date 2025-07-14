import { classPrototype } from './classPrototype'
import { hasOwnProperty } from './hasOwnProperty'

/**
 * Determines if a property is defined on an object's prototype, not including the
 * object itself or its super classes' prototypes.
 */
export function hasClassPrototypeProperty<T extends object>(object: T, key: PropertyKey): boolean {
  const proto = classPrototype(object)
  return hasOwnProperty(proto, key)
}
