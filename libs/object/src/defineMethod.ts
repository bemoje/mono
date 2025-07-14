import { AccessorDescriptor } from './isAccessorDescriptor'
import { ValueDescriptor } from './isValueDescriptor'

/**
 * Define a method property on an object with enhanced descriptor handling.
 */
export function defineMethod<T extends object, V = object>(
  obj: T,
  key: PropertyKey,
  value: V,
  des: ValueDescriptor<T> | AccessorDescriptor<T> = {},
) {
  return Object.defineProperty<T>(obj, key, {
    value,
    configurable: true,
    writable: true,
    enumerable: false,
    ...des,
  })
}
