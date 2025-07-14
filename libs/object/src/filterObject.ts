import { StringKeyOf, ValueOf } from '@mono/types'
import { keysOf } from './keysOf'

/**
 * Filter an object's own enumerable properties by predicate.
 */
export function filterObject<T extends object>(
  obj: T,
  predicate: (value: ValueOf<T>, key: StringKeyOf<T>, obj: T) => boolean,
) {
  const accum = {} as T
  for (const key of keysOf(obj)) {
    if (predicate(obj[key], key, obj)) {
      accum[key] = obj[key]
    }
  }
  return accum
}
