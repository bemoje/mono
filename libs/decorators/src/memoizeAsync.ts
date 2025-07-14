import memoizee from 'memoizee'
import ms from 'enhanced-ms'
import { MemoizeAsyncOptions, SomeAsyncFunction } from './types'
import { assertDescriptorValueIsFunction } from './assertDescriptorValueIsFunction'
import { mapGetOrDefault } from '@mono/map'

/**
 * Decorator to memoize an async method. Uses memoizee library, so if params are objects, the decorator needs a normalizer function.
 * @param maxAge The maximum age of the memoized value as number (ms) or descriptive string (e.g. '10 min'). Uses 'ms' library: https://github.com/zeit/ms
 */
export function memoizeAsync(
  maxAge?: number | string,
): (target: object, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor

/**
 * Decorator to memoize an async method.
 * @param options The options for memoization.
 */
export function memoizeAsync(
  options: MemoizeAsyncOptions,
): (target: object, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor

//
export function memoizeAsync(arg: (number | string) | MemoizeAsyncOptions = {}) {
  const opts = typeof arg === 'object' ? arg : { maxAge: typeof arg === 'number' ? arg : ms(arg) }

  return function decorator(target: unknown, key: string, descriptor?: PropertyDescriptor) {
    if (!descriptor) throw new TypeError('descriptor is undefined')
    const orig = descriptor.value
    assertDescriptorValueIsFunction(key, descriptor)
    const options = {
      length: false,
      ...opts,
      promise: true,
    } as memoizee.Options<SomeAsyncFunction>

    if (opts.instancesShareCache) {
      Reflect.deleteProperty(options, 'instancesShareCache')
      descriptor.value = memoizee(orig, options)
    } else {
      const wmap = new WeakMap()
      descriptor.value = async function (...args: any[]) {
        const memoized = mapGetOrDefault(wmap, this, () => memoizee(orig, options))
        return await memoized.apply(this, args)
      }
    }

    return descriptor
  }
}
