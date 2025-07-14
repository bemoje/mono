import { ValueOf } from '@mono/types'

/**
 * Converts an object to a Map.
 */
export function objToMap<T extends object>(obj: T): Map<string, ValueOf<T>> {
  return new Map(Object.entries(obj))
}
