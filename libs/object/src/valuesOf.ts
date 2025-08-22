import { StringKeyOf } from '@mono/types'

/**
 * Get the values of an object with type-safe return value.
 */
export function valuesOf<T extends object>(obj: T): T[StringKeyOf<T>][] {
  return Object.values(obj) as T[StringKeyOf<T>][]
}
