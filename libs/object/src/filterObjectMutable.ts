import { ValueOf } from '@mono/types'

/**
 * Mutably filter an object's own properties based on a given predicate.
 */
export function filterObjectMutable<T extends object>(
  obj: T,
  predicate: (value: ValueOf<T>, key: keyof T, obj: T) => boolean,
) {
  for (const k of Reflect.ownKeys(obj)) {
    const key = k as keyof typeof obj
    if (!predicate(obj[key], key, obj)) {
      delete obj[key]
    }
  }
  return obj as Partial<T>
}
