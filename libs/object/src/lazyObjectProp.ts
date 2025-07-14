/**
 * Define a getter method on an object that on first access will write the value to the object and then return it.
 * The getter is thereby removed and replaced with a value returned by the getter.
 */
export function lazyObjectProp<T extends object, K extends string, V>(out: T, key: K, getter: () => V) {
  return Object.defineProperty(out, key, {
    configurable: true,
    enumerable: true,
    get() {
      const value = getter()
      Object.defineProperty(out, key, { value })
      return value
    },
  }) as T & { [P in K]: V }
}
