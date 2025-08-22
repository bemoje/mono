import { AccessorDescriptor } from './isAccessorDescriptor'

/**
 * Define a setter property on an object with enhanced descriptor handling.
 */
export function defineSetter<T extends object, V = object>(
  obj: T,
  key: PropertyKey,
  set: (value: V) => void,
  des: Omit<AccessorDescriptor<V>, 'set'> = {},
) {
  return Object.defineProperty<T>(obj, key, {
    configurable: true,
    enumerable: false,
    set,
    ...des,
  })
}
