/**
 * Decorator to make a getter accessor property lazy loaded by setting the property value on the object
 */
function lazyProp(target: unknown, key: string | symbol, descriptor: PropertyDescriptor) {
  const orig = descriptor.get

  if (typeof orig !== 'function') {
    throw new Error('"get" not a function')
  }

  descriptor.get = function () {
    const value = orig.call(this)

    Object.defineProperty(this, key, { enumerable: false, writable: false, configurable: true, value })
    return value
  }

  return descriptor
}
