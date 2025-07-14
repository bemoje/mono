import { defineProperty } from './defineProperty'
import { defineValue } from './defineValue'
import { defineMethod } from './defineMethod'
import { defineAccessors } from './defineAccessors'
import { defineSetter } from './defineSetter'
import { defineGetter } from './defineGetter'
import { defineLazyProperty } from './defineLazyProperty'

/**
 * Utility object aggregating all property definition functions.
 */
export const define = {
  property: defineProperty,
  value: defineValue,
  method: defineMethod,
  accessors: defineAccessors,
  setter: defineSetter,
  getter: defineGetter,
  lazyProperty: defineLazyProperty,
}
