import { StringKeyOf } from '@mono/types'
import { entriesOf } from './entriesOf'

/**
 * Applies a callback function to each key-value pair in an object.
 */
export function objForEach<T extends object>(
  obj: T,
  fn: (value: T[StringKeyOf<T>], key: StringKeyOf<T>) => void,
): T {
  for (const [key, value] of entriesOf(obj)) {
    fn(value, key)
  }
  return obj
}
