/**
 * Defines a lazy property on an object. The property will be lazily evaluated on the first access and then cached for subsequent accesses.
 * The property is both enumerable and configurable.
 *
 * @typeParam T - The type of the object on which the property will be defined. Must be a record with string keys.
 * @param object - The object on which to define the property.
 * @param key - The key of the property to define.
 * @param getValue - A function that returns the value of the property. This function will be called the first time the property is accessed.
 * @returns The original object with the newly defined property.
 */
export function objDefineLazyProperty<T extends Record<string, unknown>>(
  object: T,
  key: string,
  getValue: (...args: unknown[]) => unknown,
): T {
  const set = (value: unknown) => {
    return Object.defineProperty(object, key, {
      value,
      enumerable: true,
      writable: true,
    })
  }

  Object.defineProperty(object, key, {
    configurable: true,
    enumerable: true,
    get() {
      const result = getValue()
      set(result)
      return result
    },
    set(value) {
      set(value)
    },
  })

  return object
}
