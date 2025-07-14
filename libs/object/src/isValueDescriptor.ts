/**
 * Check if the given descriptor is a value descriptor.
 */
export function isValueDescriptor<T>(des?: TypedPropertyDescriptor<T>): des is ValueDescriptor<T> {
  if (!des) return false
  if (des.get) return false
  if (des.set) return false
  return true
}

export type DescriptorValue<V> = { value?: V }
export type ValueDescriptorAttributes = {
  configurable?: boolean
  enumerable?: boolean
  writable?: boolean
}
export type ValueDescriptor<T> = ValueDescriptorAttributes & DescriptorValue<T>
