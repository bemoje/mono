/**
 * Updates the property descriptors of the specified properties on the given object.
 * @param object - The object whose property descriptors are to be updated.
 * @param properties - An array of property names for which the descriptors are to be updated.
 * @param update - A function that takes a property descriptor and a property name, and returns a new property descriptor.
 * @throws Will throw an error if any of the specified properties do not exist on the object.
 * @example ```ts
 * const obj = { a: 1, b: 2 };
 * objUpdatePropertyDescriptors(obj, ['a', 'b'], (descriptor, property) => {
 *   descriptor.writable = true;
 *   return obj;
 * });
 * ```
 */
export function objUpdatePropertyDescriptors<V>(
  object: Record<PropertyKey, V>,
  properties: PropertyKey[],
  update: (descriptor: PropertyDescriptor, property: PropertyKey) => PropertyDescriptor,
): void {
  for (const p of properties) {
    if (!Reflect.has(object, p)) {
      throw new Error(`Property, '${String(p)}' does not exist on object.`)
    }
    const descriptor = update(Object.getOwnPropertyDescriptor(object, p) as PropertyDescriptor, p)
    Object.defineProperty(object, p, descriptor)
  }
}
