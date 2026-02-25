import { Any } from '@mono/types'
import { DescriptorValue } from './isValueDescriptor'
import { ValueDescriptorAttributes } from './isValueDescriptor'

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
