import { StringKeyOf } from '@mono/types'

/**
 * Same as Object.entries except the keys are typed as keyof T.
 */
export function entriesOf<T extends object>(obj: T): [StringKeyOf<T>, T[StringKeyOf<T>]][] {
  return Object.entries(obj) as [StringKeyOf<T>, T[StringKeyOf<T>]][]
}
