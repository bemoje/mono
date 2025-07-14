import { isFunction } from 'lodash-es'
import { isPrototype } from '@mono/is'

/**
 * Get the class prototype object relating to an object or class.
 *
 * @remarks
 * It will never return a super class's prototype.
 *
 * Behaviours on different types of values:
 * - class constructor | function: the class's own prototype object is returned.
 * - class prototype object, the input is returned.
 * - class instance or primitives: The object's constructor's prototype is returned.
 * - null | undefined: TypeError
 */
export function classPrototype<T>(value: NonNullable<T>): typeof Object.prototype {
  if (isFunction(value)) return value.prototype
  if (isPrototype(value)) return value
  return value.constructor.prototype
}
