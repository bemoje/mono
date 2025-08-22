import { ValueOf } from '@mono/types'

/**
 * Updates the value of a specific key in an object using a callback function.
 */
export function objUpdate<T, V extends ValueOf<T>>(
  obj: T,
  key: keyof T,
  callback: (value: ValueOf<T> | undefined, key: PropertyKey, obj: T) => V,
): V {
  return (obj[key as keyof T] = callback(obj[key], key, obj))
}
