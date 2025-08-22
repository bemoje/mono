import { Any } from '@mono/types'

/**
 * Deep freezes an object.
 *
 * Note: Deep recursion may cause stack overflow for very deeply nested objects.
 */
export function objDeepFreeze(o: Record<PropertyKey, Any>): Record<PropertyKey, Any> {
  for (const key of Reflect.ownKeys(o)) {
    const value = o[key]
    if ((value && typeof value === 'object') || typeof value === 'function') {
      objDeepFreeze(value)
    }
  }
  return Object.freeze(o)
}
