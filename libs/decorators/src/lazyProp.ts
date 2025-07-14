import { GenericMap, mapGetOrDefault, TimeoutWeakMap } from '@mono/map'
import isFunction from 'lodash/isFunction'
import ms from 'enhanced-ms'
import { memoizeSync } from './memoizeSync'

/**
 * Decorator to memoize a method or getter accessor property.
 */
export function lazyProp(target: object, key: string, descriptor: PropertyDescriptor): PropertyDescriptor

/**
 * Decorator to temporarily memoize a method or getter accessor property.
 * @param maxAge The maximum age of the memoized value as number (ms) or descriptive string (e.g. '10 min'). Uses 'ms' library: https://github.com/zeit/ms
 */
export function lazyProp(
  maxAge: number | string,
): (target: object, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor

//
export function lazyProp(
  targetOrTimeout: object | number | string,
  key?: string,
  descriptor?: PropertyDescriptor,
) {
  if (typeof targetOrTimeout === 'number' || typeof targetOrTimeout === 'string') {
    const maxAge = typeof targetOrTimeout === 'number' ? targetOrTimeout : ms(targetOrTimeout)
    return createLazyPropDecorator(new TimeoutWeakMap(maxAge))
  } else {
    const decorator = createLazyPropDecorator(new WeakMap())
    return decorator(targetOrTimeout, key!, descriptor!)
  }
}

function createLazyPropDecorator<K extends object, V>(map: GenericMap<K, V, 'get' | 'set' | 'has'>) {
  return function (target: object, key: string, descriptor: PropertyDescriptor) {
    const { get, value } = descriptor

    if (isFunction(get)) {
      descriptor.get = function () {
        return mapGetOrDefault(map, this as K, () => get.call(this))
      }
      return descriptor
    }

    if (isFunction(value)) {
      return memoizeSync()(target, key, descriptor)
    }

    throw new TypeError('neither "get" nor "value" are functions')
  }
}
