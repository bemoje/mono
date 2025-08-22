import { StringKeyOf } from '@mono/types'
import { entriesOf } from './entriesOf'

/**
 * Maps over an object's entries, transforming both keys and values using the provided function.
 */
export function mapObjectEntries<T extends object, K extends string, V>(
  obj: T,
  fn: (key: StringKeyOf<T>, value: T[StringKeyOf<T>]) => [K, V],
) {
  const accum = {} as Record<K, V>
  for (const [key, value] of entriesOf(obj)) {
    const [newKey, newValue] = fn(key, value)
    accum[newKey] = newValue
  }
  return accum
}
