import { AccessorDescriptor } from './isAccessorDescriptor'

/**
 * Define a getter property on an object with enhanced descriptor handling.
 */
export function defineGetter<T extends object, V = object>(
  obj: T,
  key: PropertyKey,
  get: () => V,
  des: Omit<AccessorDescriptor<V>, 'get'> = {},
) {
  return Object.defineProperty<T>(obj, key, {
    configurable: true,
    enumerable: false,
    get,
    ...des,
  })
}
