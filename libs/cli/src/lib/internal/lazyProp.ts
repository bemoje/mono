/**
 * Decorator to make a getter accessor property lazy loaded by setting the property value on the object
 */
export default function lazyProp(
  target: unknown,
  key: string | symbol,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const get = descriptor.get
  const func = descriptor.value

  if (typeof get === 'function') {
    descriptor.get = function () {
      const retval = get.call(this)
      Object.defineProperty(this, key, {
        enumerable: false,
        writable: true,
        configurable: true,
        value: retval,
      })
      return retval
    }
  } else if (typeof func === 'function') {
    descriptor.value = function () {
      const retval = func.call(this)
      Object.defineProperty(this, key, {
        enumerable: false,
        writable: true,
        configurable: true,
        value: () => retval,
      })
      return retval
    }
  } else {
    throw new Error(`@lazyProp can only be used on getter or method: ${String(key)}`)
  }

  return descriptor
}
