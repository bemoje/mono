import { AccessorDescriptor } from './isAccessorDescriptor'
import { ValueDescriptor } from './isValueDescriptor'

/**
 * Define a value property on an object with enhanced descriptor handling.
 */
export function defineValue<T extends object, V = object>(
  obj: T,
  key: PropertyKey,
  value: V,
  des: ValueDescriptor<T> | AccessorDescriptor<T> = {},
) {
  return Object.defineProperty<T>(obj, key, {
    configurable: true,
    value,
    enumerable: true,
    ...des,
  })
}
