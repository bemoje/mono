/**
 * Asserts that a property descriptor contains a function value.
 */
export function assertDescriptorValueIsFunction(key: string, descriptor: PropertyDescriptor) {
  if (!(typeof descriptor.value === 'function' && descriptor.value !== Function.prototype)) {
    throw new TypeError(`"value" not a function for ${key} with descriptor: ${JSON.stringify(descriptor)}.`)
  }
}
