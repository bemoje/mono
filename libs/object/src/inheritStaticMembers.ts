import { Constructor } from 'type-fest'

/**
 * Copies static members from a source constructor to a target constructor, excluding specified keys.
 */
export function inheritStaticMembers<T extends Constructor<object>>(
  target: T,
  source: Constructor<object>,
  ignoreKeys: PropertyKey[] = [],
): T {
  const ignore: Set<PropertyKey> = new Set([...ignoreKeys, 'prototype', 'name', 'constructor'])
  for (const key of Reflect.ownKeys(source)) {
    if (ignore.has(key)) continue
    if (Reflect.has(target, key)) continue
    const des = Object.getOwnPropertyDescriptor(source, key)
    Object.defineProperty(target, key, des as PropertyDescriptor)
  }
  return target
}
