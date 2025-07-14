/**
 * Realizes a lazy property by defining it as a non-writable, non-configurable value on the object.
 */
export function realizeLazyProperty<T>(obj: unknown, key: string, value: T) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    writable: false,
    configurable: false,
    value,
  })
  return value
}
