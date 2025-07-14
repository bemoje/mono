/**
 * Deletes a property from an object and returns the modified object.
 * @param obj The object from which to delete the property.
 * @template K - The type of the keys in the object.
 * @returns The modified object with the key deleted.
 * @param key The key of the property to delete.
 * @example ```ts
 * const obj = { name: 'John', age: 30 };
 * objDelete(obj, 'age');
 * //=> { name: 'John' }
 * ```
 */
export function objDelete<K extends PropertyKey, V>(obj: Record<K, V>, key: K): Omit<Record<K, V>, K> {
  delete obj[key]
  return obj
}
