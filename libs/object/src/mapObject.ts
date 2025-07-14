import { StringKeyOf } from '@mono/types'
import { entriesOf } from './entriesOf'

/**
 * Maps over an object's values, transforming each value using the provided function.
 */
export function mapObject<T extends object, V>(obj: T, fn: (value: T[StringKeyOf<T>], key: StringKeyOf<T>) => V) {
  const accum = {} as Record<StringKeyOf<T>, V>
  for (const [key, value] of entriesOf(obj)) {
    accum[key] = fn(value, key)
  }
  return accum
}
