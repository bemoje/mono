/**
 * Converts the specified properties of an object into getter functions.
 * @template K - The type of the keys of the object.
 * @template V - The type of the values of the object.
 * @template T - The type of the object.
 * @param object The object whose properties are to be converted into getter functions.
 * @param propertyNames The names of the properties to be converted into getter functions.
 * @returns The object with the specified properties converted into getter functions.
 * @throws Throws an error if the property descriptor for a specified property name is not found.
 * @example ```ts
 * const obj = { a: 1, b: 2, c: 3 };
 * objPropertyValueToGetter(obj, 'a', 'b');
 * obj.a;
 * //=> 1
 * obj.b;
 * //=> 2
 * obj.c;
 * //=> 3
 * ```
 */
export function objPropertyValueToGetter<V, T extends Record<PropertyKey, V>>(
  object: T,
  ...propertyNames: PropertyKey[]
): T {
  for (const propertyName of propertyNames) {
    const descriptor = Object.getOwnPropertyDescriptor(object, propertyName)
    if (!descriptor) throw new Error(`Property descriptor for '${String(propertyName)}' not found.`)
    const { enumerable, configurable, value } = descriptor
    Object.defineProperty(object, propertyName, { enumerable, configurable, get: () => value })
  }
  return object
}
