/**
 * Checks if an object has a specific key.
 * @param obj The object to check.
 * @template K - The type of the keys in the object.
 * @returns Returns true if the object has the key, false otherwise.
 * @param key The key to check for.
 * @example ```ts
 * const myObj = { name: 'John', age: 30 };
 * objHas(myObj, 'name');
 * //=> true
 * objHas(myObj, 'email');
 * //=> false
 * ```
 */
export function objHas<V>(obj: Record<PropertyKey, V>, key: PropertyKey): boolean {
  return Reflect.has(obj, key)
}
