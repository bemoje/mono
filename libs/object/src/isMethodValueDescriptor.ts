import { Any } from '@mono/types'
import { ValueDescriptorAttributes, DescriptorValue } from './isValueDescriptor'

/**
 * Checks if a property descriptor represents a method (function value descriptor).
 */
export function isMethodValueDescriptor(
  descriptor: PropertyDescriptor,
): descriptor is TypedValuePropertyDescriptor<typeof Function.prototype> {
  return typeof descriptor.value === 'function' && descriptor.value !== Function.prototype
}

export type TypedValuePropertyDescriptor<V = unknown> = ValueDescriptorAttributes &
  DescriptorValue<V> &
  ThisType<Any>
