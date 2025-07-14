import { StringKeyOf } from '@mono/types'
import { entriesOf } from './entriesOf'

/**
 * Maps over an object's keys, transforming each key using the provided function while preserving values.
 */
export function mapObjectKeys<T extends object, K extends string>(
  obj: T,
  fn: (key: StringKeyOf<T>, value: T[StringKeyOf<T>]) => K,
) {
  const accum = {} as Record<K, T[StringKeyOf<T>]>
  for (const [key, value] of entriesOf(obj)) {
    accum[fn(key, value)] = value
  }
  return accum
}
