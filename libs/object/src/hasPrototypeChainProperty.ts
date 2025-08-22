import { getClassChain } from './getClassChain'
import { hasOwnProperty } from './hasOwnProperty'

/**
 * Determines if a property is defined on an object's prototype prototype chain, not
 * including the object itself.
 */
export function hasPrototypeChainProperty<T extends object>(object: T, key: PropertyKey): boolean {
  return getClassChain(object).some((ctor) => hasOwnProperty(ctor.prototype, key))
}
