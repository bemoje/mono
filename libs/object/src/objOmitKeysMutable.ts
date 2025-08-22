import { Any } from '@mono/types'

/**
 * Deletes the specified keys from an object in a mutable way.
 * @param obj The object from which to delete the keys.
 * @returns The modified object with the specified keys deleted.
 * @typeparam V - The type of the values in the object.
 * @param keys The keys to delete from the object.
 * @example ```ts
 * const obj = { a: 1, b: 2, c: 3 };
 * objOmitKeysMutable(obj, 'a', 'c');
 * //=> { b: 2 }
 * ```
 */
export function objOmitKeysMutable<O extends Record<PropertyKey, Any>>(obj: O, ...keys: PropertyKey[]) {
  for (const key of keys) {
    if (!Object.hasOwn(obj, key)) continue
    Reflect.deleteProperty(obj, key)
  }
  return obj
}
