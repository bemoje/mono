import { AccessorDescriptor } from './isAccessorDescriptor'

/**
 * Define accessor properties (getter and setter) on an object with enhanced descriptor handling.
 */
export function defineAccessors<T extends object, V = object>(
  obj: T, //
  key: PropertyKey,
  des: AccessorDescriptor<V>,
) {
  return Object.defineProperty<T>(obj, key, {
    configurable: true,
    enumerable: false,
    ...des,
  })
}
