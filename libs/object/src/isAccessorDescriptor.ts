/**
 * Check if the given descriptor is an accessor descriptor.
 */
export function isAccessorDescriptor<T>(des?: TypedPropertyDescriptor<T>): des is AccessorDescriptor<T> {
  if (!des) return false
  if (!des.get && !des.set) return false
  if (des.writable !== undefined) return false
  return true
}

export type DescriptorGetter<V> = { get: () => V }
export type DescriptorSetter<V> = { set: (value: V) => void }
export type DescriptorBothAccessors<V> = DescriptorGetter<V> & DescriptorSetter<V>
export type DescriptorAccessors<V> = DescriptorGetter<V> | DescriptorSetter<V> | DescriptorBothAccessors<V>
export type AccessorsDescriptorAttributes = {
  configurable?: boolean
  enumerable?: boolean
}
export type AccessorDescriptor<T> = AccessorsDescriptorAttributes & DescriptorAccessors<T>
