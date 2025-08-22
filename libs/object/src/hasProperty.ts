import { hasOwnProperty } from './hasOwnProperty'
import { hasPrototypeChainProperty } from './hasPrototypeChainProperty'

/**
 * Determines if a property is defined on an object, including 'own' and prototype chain.
 */
export function hasProperty<T extends object>(object: T, key: PropertyKey): key is keyof T {
  return hasOwnProperty(object, key) || hasPrototypeChainProperty(object, key)
}
