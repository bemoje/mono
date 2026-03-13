import type { Constructor } from 'type-fest'

/**
 * Copies static members from a source constructor to a target constructor, excluding specified keys.
 */
export function inheritStaticMembers<T extends Constructor<object>>(
  target: T,
  source: Constructor<object>,
  ignoreKeys: PropertyKey[] = []
): T {
  const ignore: Set<PropertyKey> = new Set([...ignoreKeys, 'prototype', 'name'])
  for (const key of Reflect.ownKeys(source)) {
    if (!ignore.has(key) && !Object.hasOwn(target, key)) {
      const des = Object.getOwnPropertyDescriptor(source, key)
      if (des) {
        Object.defineProperty(target, key, des)
      }
    }
  }
  return target
}
