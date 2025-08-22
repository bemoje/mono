import { defineProperty } from './defineProperty'
import { hasOwnProperty } from './hasOwnProperty'

/**
 * Sets the enumerable property of the specified properties of an object to true.
 */
export function setEnumerable<T extends object>(object: T, ...keys: PropertyKey[]): void {
  for (const key of keys) {
    if (!hasOwnProperty(object, key)) continue
    defineProperty(object, key, { enumerable: true })
  }
}
