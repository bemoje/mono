import { AccessorDescriptor } from './isAccessorDescriptor'
import { ValueDescriptor } from './isValueDescriptor'

/**
 * Utility function for defining properties on objects with enhanced descriptor handling.
 */
export function defineProperty<T extends object>(
  obj: T, //
  key: PropertyKey,
  des: ValueDescriptor<T> | AccessorDescriptor<T>,
) {
  return Object.defineProperty<T>(obj, key, { configurable: true, ...des })
}
