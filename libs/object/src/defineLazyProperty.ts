import type { AccessorDescriptor } from './isAccessorDescriptor'
import { defineGetter } from './defineGetter'
import { defineValue } from './defineValue'

/**
 * Define a lazy property that evaluates its getter on first access and then caches the value.
 */
export function defineLazyProperty<T extends object, V = object>(
  obj: T,
  key: PropertyKey,
  get: () => V,
  des: Omit<AccessorDescriptor<V>, 'get'> = {}
) {
  function getter(this: T) {
    const value = get.call(this)
    defineValue(this, key, value)
    return value
  }
  return defineGetter(obj, key, getter, des)
}
