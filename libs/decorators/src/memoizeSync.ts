import memoizee from 'memoizee'
import ms from 'enhanced-ms'
import { MemoizeSyncOptions, SomeSyncFunction } from './types'
import { assertDescriptorValueIsFunction } from './assertDescriptorValueIsFunction'
import { mapGetOrDefault } from '@mono/map'

/**
 * Decorator to memoize a sync method.
 * @param maxAge The maximum age of the memoized value as number (ms) or descriptive string (e.g. '10 min'). Uses 'ms' library: https://github.com/zeit/ms
 */
export function memoizeSync(
  maxAge?: number | string,
): (target: object, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor

/**
 * Decorator to memoize a sync method.
 * @param options The options for memoization.
 */
export function memoizeSync(
  options: MemoizeSyncOptions,
): (target: object, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor

//
export function memoizeSync(arg: (number | string) | MemoizeSyncOptions = {}) {
  const opts = typeof arg === 'object' ? arg : { maxAge: typeof arg === 'number' ? arg : ms(arg) }

  return function decorator(target: unknown, key: string, descriptor?: PropertyDescriptor) {
    if (!descriptor) throw new TypeError('descriptor is undefined')
    const orig = descriptor.value
    assertDescriptorValueIsFunction(key, descriptor)
    const options = { length: false, ...opts } as memoizee.Options<SomeSyncFunction>

    if (opts.instancesShareCache) {
      Reflect.deleteProperty(options, 'instancesShareCache')
      descriptor.value = memoizee(orig, options)
    } else {
      const wmap = new WeakMap()
      descriptor.value = function (...args: any[]) {
        const memoized = mapGetOrDefault(wmap, this, () => memoizee(orig, options))
        return memoized.apply(this, args)
      }
    }

    return descriptor
  }
}
