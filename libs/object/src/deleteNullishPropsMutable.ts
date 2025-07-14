/**
 * Mutably delete enumerable properties with null or undefined values.
 */
export function deleteNullishPropsMutable<T extends object>(obj: T) {
  for (const [key, value] of Object.entries(obj)) {
    if (value == null) {
      Reflect.deleteProperty(obj, key)
    }
  }
  return obj as T
}
